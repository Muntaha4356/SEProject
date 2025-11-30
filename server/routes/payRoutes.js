import express from "express"
import { chatgptAfterDonation, donateOnline } from "../controller/payController.js";
const payRouter = express.Router();
payRouter.post("/create-checkout-session", donateOnline)
// payRouter.get("/donation-details", fundWebhook)

export default payRouter;