// ./stripe listen --forward-to localhost:3000/webhook
import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import organisationRouter from "./routes/organisationRoutes.js"
import supabase from "./config/supabaseClient.js"
import campaignRouter from "./routes/compaignRoutes.js"
// 123
import Stripe from "stripe"
import { chatgptAfterDonation, donateOnline } from "./controller/payController.js"
import payRouter from "./routes/payRoutes.js"
const app = express();

// 123
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const port =process.env.PORT || 3000;

// connectDb();

app.post("/webhook", express.raw({ type: "application/json" }), chatgptAfterDonation )

app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use(cors({
    origin: "https://se-project-ib81.vercel.app",
    credentials: true})) //sending cookies in response tofrontend

//123



app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.post("/create-checkout-session", donateOnline );



app.use("/api/org", organisationRouter);
app.use("/api/campaigns", campaignRouter );
app.use("/api/pay", payRouter)
const connectWithRetry = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DB connected");

    app.listen(port, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed. Retrying in 5s...");
    setTimeout(connectWithRetry, 5000);
  }
};

// connectWithRetry();

app.listen(port , ()=> console.log(`Server started on port ${port}`));
