import userModel from "../models/organizationModel.js";

export const getUserData = async(req, res) =>{
    try{
        const {userId} = req.body;
        //finding the use
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false, message: "User Not Found"})
        }
        
        res.json({
            success: true,
            userData:{
                name: user.name,
                status : user.status,
                

            }
        });

    }catch(error){
        res.json({success:false, message: error.message})
    }
}
