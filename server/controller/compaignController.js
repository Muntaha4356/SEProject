import pool from "../config/db.js";

export const createCampaign = async (req, res) => {
  try {
    const { name, description, purpose, targetAmount, banner, orgId } = req.body;



    if (!orgId) {
      return res.status(400).json({ error: "organization_id missing" });
    }
    if (!name || !purpose || !description || !targetAmount) {
      return res.status(400).json({ error: "Missing Details" });
    }
    if (!Number.isFinite(Number(targetAmount)) || Number(targetAmount) <= 0) {
      return res.status(400).json({ error: "Invalid targetAmount" });
    }
    const orgCheck = await pool.query(
      "SELECT id FROM organizations WHERE id = $1",
      [orgId]
    );
    if (orgCheck.rows.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }


    // 2️⃣ Optional: Prevent duplicate campaign name for same org
    const duplicateCheck = await pool.query(
      `SELECT id FROM campaigns WHERE name = $1 AND organization_id = $2`,
      [name.trim(), orgId]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ error: "Campaign with this name already exists" });
    }


    const created_at = new Date().toISOString();
    const start_date = created_at.split("T")[0];
    const end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const status = "pending";

    const query = `
      INSERT INTO campaign_creation_request
      (organization_id, name, purpose, description, target_amount, end_date, created_at, status, banner, start_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10)
      RETURNING *;
    `;

    const values = [
      orgId,
      name,
      purpose,
      description,
      targetAmount,
      end_date,
      created_at,
      status,
      banner,
      start_date
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Campaign created successfully",
      campaign: result.rows[0],
    });

  } catch (error) {
    console.log("Create Campaign Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getCampaignInfo = async (req, res) => {
  try {
    const { id } = req.params; // get campaign ID from URL

    if (!id) {
      return res.status(400).json({ success: false, message: "Campaign ID is required" });
    }
    if (isNaN(id)) return res.status(400).json({ message: "Invalid campaign ID" });



    // Query to get all columns from the campaigns table
    const query = `SELECT * FROM campaigns WHERE id = $1;`;
    const result = await pool.query(query, [id]);



    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.status(200).json({
      success: true,
      campaign: result.rows[0],
    });

  } catch (error) {
    console.error("Get Campaign Info Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};





export const getActiveCampaigns = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM campaigns WHERE status = $1",
      ["active"]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching active campaigns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCampaignsByOrgId = async (req, res) => {
  try {
    const { orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const query = `SELECT * FROM campaigns WHERE organization_id = $1;`;
    const result = await pool.query(query, [orgId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        campaigns: [],
        message: "No campaigns found for this organization",
      });
    }

    return res.status(200).json({
      success: true,
      campaigns: result.rows,
    });
  } catch (error) {
    console.error("Get Campaigns by Org ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




export const reqFundAlocation = async (req, res) => {
  try {
    const { campaign_id } = req.body;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

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

    // Update campaign status to active
    const updateQuery = `UPDATE campaigns SET has_requested = true WHERE id = $1 RETURNING *;`;
    const updateResult = await pool.query(updateQuery, [campaign_id]);

    return res.status(201).json({
      success: true,
      message: "Fund allocation request submitted",
      request: result.rows[0],
    });

  } catch (error) {
    console.error("Fund Allocation Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



export const cancelFundRequest = async (req, res) => {
  try {
    const { campaign_id } = req.body;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    // Delete fund allocation request
    const deleteQuery = `DELETE FROM fund_allocation_request WHERE campaign_id = $1 RETURNING *;`;
    const deleteResult = await pool.query(deleteQuery, [campaign_id]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fund allocation request found for this campaign",
      });
    }

    // Update campaign status to inactive
    const updateQuery = `UPDATE campaigns SET has_requested = false WHERE id = $1 RETURNING *;`;
    const updateResult = await pool.query(updateQuery, [campaign_id]);

    return res.status(200).json({
      success: true,
      message: "Fund allocation request cancelled and campaign deactivated",
      cancelledRequest: deleteResult.rows[0],
      campaign: updateResult.rows[0],
    });

  } catch (error) {
    console.error("Cancel Fund Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getCampaignStats = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign_id = parseInt(id, 10);

    if (!campaign_id) {
      return res.status(400).json({ success: false, message: "Campaign ID is required" });
    }

    const campaignQuery = `SELECT created_at FROM campaigns WHERE id = $1;`;
    const campaignResult = await pool.query(campaignQuery, [campaign_id]);

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    const createdAt = new Date(campaignResult.rows[0].created_at);
    const now = new Date();
    const daysActive = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    // 2. Count donors
    const donorQuery = `SELECT COUNT(*) FROM donations WHERE campaign_id = $1;`;
    const donorResult = await pool.query(donorQuery, [campaign_id]);
    const donorsCount = parseInt(donorResult.rows[0].count, 10);

    return res.status(200).json({
      success: true,
      stats: {
        donors_count: donorsCount,
        days_active: daysActive,
        created_at: createdAt.toISOString(),
      },
    });

  } catch (error) {
    console.error("Get Campaign Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const verifyCampaignExistence = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign_id = parseInt(id, 10);

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }


    const query = `SELECT * FROM campaigns WHERE id = $1;`;
    const result = await pool.query(query, [campaign_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      campaign: result.rows[0],
    });

  } catch (error) {
    console.error("Get Campaign Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


// controllers/campaignController.js
export const verifyCampaignOwnership = async (req, res) => {
  const { campaignId } = req.params;
  const id = req.body.orgId; // from middleware
  const userOrgId = id;
  if (!campaignId) {
    return res.status(400).json({
      success: false,
      message: "Campaign ID is required"
    });
  }

  try {
    const query = `SELECT organization_id FROM campaigns WHERE id = $1`;
    const result = await pool.query(query, [campaignId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    let isOwner = false;

    const campaignOrgId = result.rows[0].organization_id;

    if (campaignOrgId === userOrgId) { //camporgid is the org id of logged inuser and campaignid is literally campaigni provided by useer
      isOwner = true;
    }
    console.log("isowner", isOwner)

    return res.status(200).json({ success: true, isOwner });
  } catch (error) {
    console.error("Ownership check error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


