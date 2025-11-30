import supabase from "../config/supabaseClient.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
export const createOrganization = async (req, res) => {
  try {
    const {
      name,
      org_email,
      password,
      subscribed,
      org_type,
      website_url,
      about,
      country,
      phone_number,
      office_address,
      serial_number
    } = req.body;

    if (!name || !org_email || !password || !website_url || !phone_number || !serial_number) {
      return res.json({ success: false, message: 'Missing details' })
    }


    // Check if email exists already or not
    const existing = await pool.query(
      "SELECT id FROM organizations WHERE contact_email = $1",
      [org_email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);



    const query = `
      INSERT INTO organizations 
      (name, contact_email, password, subscribed, org_type, website_url, about, country, phone_number, office_address, serial_no, verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, name, contact_email, serial_no;
    `;

    const values = [
      name,
      org_email,
      hashedPassword,
      subscribed,
      org_type,
      website_url,
      about,
      country,
      phone_number,
      office_address,
      serial_number,
      false,
    ];

    const result = await pool.query(query, values);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Problem creating organisation"
      });
    }
    const newOrgId = result.rows[0].id;
    const token_applied = jwt.sign({ id: newOrgId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true for SameSite=None
      sameSite: "None", // required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(201).json({
      success: true,
      message: "Organisation registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    })
  }

};


export const loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if organization exists
    const org = await pool.query(
      "SELECT id, name, password FROM organizations WHERE contact_email = $1",
      [email]
    );

    if (org.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    const organization = org.rows[0];

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: organization.id, name: organization.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true for SameSite=None
      sameSite: "None", // required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { id: organization.id, name: organization.name, email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',



    })
    return res.json({ success: true, message: "Logged Out successfully" })
  } catch (e) {
    res.json({ success: false, message: error.message })
  }
}

export const showAllRows = async (req, res) => {
  const { data, error } = await supabase
    .from("organizations")
    .select("*"); // * means all columns

  if (error) return res.status(400).json({ error });

  res.status(200).json({ data });
};


export const showAllTables = async (req, res) => {
  const { data, error } = await supabase.rpc("get_tables");

  if (error) return res.status(400).json({ error });

  res.status(200).json({ data });
};


export const checkOrgAuth = (req, res) => {
  const { orgId } = req.body;
  if (!orgId) {
    return res.json({ authenticated: false, organization_id: null });
  }
  return res.json({ authenticated: true, organization_id: orgId });
};

export const getOrgId = async (req, res) => {
  return res.json({
    success: true,
    orgId: req.body.orgId
  });
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const { orgId } = req.params;
    const organization_id = parseInt(orgId, 10);

    if (!organization_id) {
      return res.status(400).json({ success: false, message: "Organization ID is required" });
    }

    // 1. Total Donations
    const donationQuery = `
      SELECT COUNT(*) FROM donations
      WHERE campaign_id IN (
        SELECT id FROM campaigns WHERE organization_id = $1
      );
    `;
    const donationResult = await pool.query(donationQuery, [organization_id]);
    const totalDonations = parseInt(donationResult.rows[0].count, 10);

    // 2. Active Campaigns
    const activeQuery = `
      SELECT COUNT(*) FROM campaigns
      WHERE organization_id = $1 AND status = 'active';
    `;
    const activeResult = await pool.query(activeQuery, [organization_id]);
    const activeCampaigns = parseInt(activeResult.rows[0].count, 10);

    // 3. Pending Requests
    const pendingQuery = `
      SELECT COUNT(*) FROM campaign_creation_request
      WHERE organization_id = $1;
    `;
    const pendingResult = await pool.query(pendingQuery, [organization_id]);
    const pendingRequests = parseInt(pendingResult.rows[0].count, 10);

    return res.status(200).json({
      success: true,
      metrics: {
        total_donations: totalDonations,
        active_campaigns: activeCampaigns,
        pending_requests: pendingRequests,
      },
    });

  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
