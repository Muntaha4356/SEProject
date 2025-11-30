import express from "express"
import { checkOrgAuth, createOrganization, getDashboardMetrics, getOrgId, loginOrganization, logout, showAllRows } from "../controller/organisationController.js"
import organisationAuth from "../middleware/oganisationsAuth.js";
const organisationRouter = express.Router();

organisationRouter.post("/register", createOrganization);
organisationRouter.post("/login", loginOrganization)
organisationRouter.get("/rows", showAllRows)
organisationRouter.post("/logout", logout)
organisationRouter.get('/auth', organisationAuth, checkOrgAuth )
organisationRouter.post('/getId', organisationAuth, getOrgId)
organisationRouter.get("/metrics/:orgId", getDashboardMetrics)
export default organisationRouter;
