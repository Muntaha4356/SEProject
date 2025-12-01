import { response } from "express";
import express from "express"
import pool from "../config/db.js";
import Stripe from "stripe";

const Stripe_Secret_key = process.env.STRIPE_SECRET_KEY

const stripe = new Stripe(Stripe_Secret_key, {
  apiVersion: '2023-10-16', // Use a recent stable API version
});


export const donateOnline = async (req, res) => {
  const { amount, currency = 'usd', campaignId } = req.body;
  if (!amount || typeof amount !== 'number') { // Stripe minimum charge is usually 50 cents (or equivalent)
    return res.status(400).json({ error: "Invalid donation amount specified. Must be at least 0.50." });
  }

  try {
    // 1. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'One-Time Donation',
              description: 'Support for our ongoing project.',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: "https://se-project-ib81.vercel.app/donation-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://se-project-ib81.vercel.app/donation-cancel",

      metadata: {
        donorId: req.user?.id || 'anonymous', // Example: If user is authenticated
        originalAmount: amount,
        campaignId: req.body.campaignId,
      }
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (e) {
    console.error("Stripe Checkout Session Error:", e);
    return res.status(500).json({
      error: "Failed to create Stripe Checkout Session.",
      details: e.message
    });
  }
}




const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const chatgptAfterDonation = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.customer_details?.email;
    const name = session.customer_details?.name;
    const country = session.customer_details?.address?.country;
    const amount = session.amount_total / 100;
    const campaignId = session.metadata.campaignId;


    console.log("🎉 PAYMENT SUCCESS");
    console.log(amount, "amount");

    console.log("Donor:", name);
    console.log("Donor:", email);
    console.log("Donor:", country);
    console.log("Campaign:", campaignId);
    console.log("Amount:", session.amount_total / 100);

    try {
      const insertDonorQuery = `
        INSERT INTO donors (name, email, country)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `;
      const result = await pool.query(insertDonorQuery, [name, email, country]);

      let donorId;
      if (result.rows.length > 0) {
        donorId = result.rows[0].id;
        console.log("New donor added with ID:", donorId);
      } else {
        // Case B: Donor already existed (conflict occurred), fetch existing ID
        const existingDonorQuery = `
          SELECT id FROM donors WHERE email = $1;
        `;
        const existingDonorResult = await pool.query(existingDonorQuery, [email]);

        if (existingDonorResult.rows.length === 0) {
          // Safety check: This should never happen if the Stripe session provided an email
          throw new Error("Existing donor email not found after conflict.");
        }
        donorId = existingDonorResult.rows[0].id;
        console.log("Existing donor ID:", donorId);
      }

      // Check if donorId was successfully retrieved before proceeding
      if (!donorId) {
        throw new Error("Failed to determine Donor ID.");
      }

      // 2. Insert donation into donations table
      const insertDonationQuery = `
        INSERT INTO donations (campaign_id, donor_id, amount_donated, donated_at, payment_method, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
      // Using `new Date().toISOString()` is generally better for PostgreSQL timestamp fields
      const donationResult = await pool.query(insertDonationQuery, [
        campaignId,
        donorId,
        amount,
        new Date().toISOString(),
        "stripe",
        "success",
      ]);

      

      console.log("Donation recorded with ID:", donationResult.rows[0].id);

      const updateCampaignQuery = `
        UPDATE campaigns
        SET collected_amount = collected_amount + $1
        WHERE id = $2
        RETURNING collected_amount;
      `;
      console.log("my amount for donor", typeof (amount), amount)

      const campaignUpdateResult = await pool.query(updateCampaignQuery, [
        amount,
        campaignId,
      ]);

      if (campaignUpdateResult.rows.length > 0) {
        const { collected_amount, target_amount, has_requested } = campaignUpdateResult.rows[0];
        console.log(
          "Updated campaign collected_amount:",
          campaignUpdateResult.rows[0].collected_amount
        );

        if (collected_amount >= target_amount) {
          console.log("Goal reached. Triggering fund allocation...");
          await triggerFundAllocation(Number(campaignId));
        }


      } else {
        console.warn("Campaign not found for ID:", campaignId);
      }

    } catch (error) {
      console.error("Error saving donor/donation data:", error.message);
    }
  }

  res.json({ received: true });
};

export const triggerFundAllocation = async (campaign_id) => {
  if (!campaign_id) throw new Error("Campaign ID is required");

  const requested_at = new Date().toISOString();
  const review_status = "pending";

  const query = `
    INSERT INTO fund_allocation_request
    (campaign_id, review_status, requested_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [campaign_id, review_status, requested_at];
  const result = await pool.query(query, values);

  const updateQuery = `UPDATE campaigns SET has_requested = true WHERE id = $1 RETURNING *;`;
  await pool.query(updateQuery, [campaign_id]);

  return result.rows[0];
};

