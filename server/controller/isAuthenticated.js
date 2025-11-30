import userModel from "../models/organizationModel.js";
export const isAuthenticated =async(req, res) =>{
    try{
        const {userId} = req.body;
        if(!userId){
            return res.json({success: false,message: "User id not found"})
        }
        const userExist = await userModel.findById(userId);
        if (!userExist) {
            return res.json({ success: false, message: "User not found" });
        }
        if (userExist.status==false){
            return res.json({success: false, message: "Account Not Verified"})

        }
        return res.json({success: true, message: "Account Verified"})
        



    }catch(error){
        res.json({success: false, message: error.message})
    }
}