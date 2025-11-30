import userModel from "../models/organizationModel.js";
import transporter from "../config/nodemailer.js";
export const SendVerifyOTP =async(req, res)=>{
    try{
        const {userId} =req.body;
        const userExist = await userModel.findById(userId);
        if (!userExist) {
            return res.json({ success: false, message: "User not found" });
        }
        if (userExist.status){
            return res.json({success: false, message: "Account Already Verified"})

        }
        //generation of otp
        const OTP= String(Math.floor(100000 + Math.random() * 900000));
        //PUT OTP in mongodb
        userExist.verifyOTP = OTP;
        //assigning
        userExist.verifyOTPExpireAt =new Date( Date.now() + 24 * 60 * 60 * 1000);

        await userExist.save();

        //sending OTP email 
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userExist.email,
            subject: 'OTP for Verifying the account',
            text: `Your OTP is ${OTP}`,
        }

        await transporter.sendMail(mailOptions);

        res.json({success: true, message: "Verification OTP sent"})

    }catch(error){
        return res.json({success: false, message: error.message})  
    }
}


export const VerifyAccount = async(req, res)=>{
    const {userId, otp} = req.body;
    if(!userId || !otp){
        return res.json({success: true, message:"Register to Verify, OTP isn't available"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: 'User not found'});

        }
        if(user.verifyOTP==='' || user.verifyOTP !== otp){
            console.log("Otp mismatched");
            return res.json({success:false, message:'Invalid Otp, Generate the OTP'})
        }
        //check for expiry date
        if(user.verifyOTPExpireAt.getTime() < Date.now()){
            console.log("Otp expired");
            return res.json({success: false, message: "OTP expired"})
        }
        user.status= true;
        user.verifyOTP='';
        user.verifyOTPExpireAt=null;
        
        await user.save();
        console.log("Updating user status to true for user:", user._id);
        return res.json({success:true, message:"User Verified successfully"});
    }
    catch(error){
       return res.json({success: false, message: error.message})  
    }
}