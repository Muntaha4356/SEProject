import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        res.json({success: false, message: "Token not available... Login again"})
    }
    try{
        const tokenDecode= jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body = req.body || {};
            req.body.userId = tokenDecode.id; //if Id is available we are sending it to the body
        }else{
            return res.json({success:false, message:"Token doesn't have id"})
        }

        next();

    }catch(error){
        res.json ({success: false,message: error.message})
    }
}

export default userAuth;