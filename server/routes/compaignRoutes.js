import express from "express";
import { cancelFundRequest, createCampaign, getActiveCampaigns, getCampaignInfo, getCampaignsByOrgId, reqFundAlocation, verifyCampaignExistence, verifyCampaignOwnership} from "../controller/compaignController.js";
import organisationAuth from "../middleware/oganisationsAuth.js";

const campaignRouter = express.Router();

campaignRouter.post("/create", organisationAuth, createCampaign );
campaignRouter.get("/info/:id", getCampaignInfo );
campaignRouter.get("/active", getActiveCampaigns);
campaignRouter.post("/getcampoforg",organisationAuth,getCampaignsByOrgId )
campaignRouter.post("/requestfund",  reqFundAlocation)
campaignRouter.post("/cancelfundrequest", cancelFundRequest)
campaignRouter.get("/verify-campId/:id", verifyCampaignExistence )

campaignRouter.post("/verify-ownership/:campaignId", organisationAuth, verifyCampaignOwnership );
export default campaignRouter;
