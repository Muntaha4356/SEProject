import userModel from "../models/organizationModel.js";
import transporter from "../config/nodemailer.js";
import bcrypt from 'bcryptjs'
export const resetPasswordOtpSend= async(req, res)  => {
    
        const {email} = req.body;
        if (!email){
            return res.json({success: false, message:"Email isrequired"})
        }
        try{
         const user = await userModel.findOne({email});
         if(!user){
            return res.json({success: false, message:"Email is not registered or valid"})
         }  
          const OTP= String(Math.floor(100000 + Math.random() * 900000));
          user.resetOtp=OTP;
          user.resetOptExpireAt=Date.now() + 15 * 60 *1000; //15 minutes

          await user.save();
          const mailOptions = {
                      from: process.env.EMAIL_USER,
                      to: email,
                      subject: 'ResetOtp',
                      text: `Your OTP is ${OTP}`,
        }
          
          await transporter.sendMail(mailOptions);

        return res.json({success: true, message:"OTP sent to the account"})

    }catch(error){
        res.json({success: false, message: error.message})
    }
}


export const resetPassword = async (req, res) =>{
    const {email, otp, newPassword} = req.body;

    if(!email, !otp,!newPassword){
        return res.json ({success: false, message: "Missing details"})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User not availabe"});
        }
        if(user.resetOtp!== otp || user.resetOtp === ''){
            return res.json({success:false, message:"Invalid OTP"})
        }
        if(user.resetOptExpireAt < Date.now()){
            return res.json({success:false, message: "OTP Expired"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12)
        user.password = hashedPassword;
        user.resetOptExpireAt= 0;
        user.resetOtp= '';
        await user.save()
        return res.json({success: true, message:"Password Reset"})

    }catch(error){
        res.json({success: false, message: error.message})

    }
}