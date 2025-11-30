import jwt from 'jsonwebtoken'

const organisationAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success: false, message: "Token not available... Login again"})
    }
    try{
        const tokenDecode= jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body = req.body || {};
            req.body.orgId = tokenDecode.id; //if Id is available we are sending it to the body
        }else{
            return res.status(401).json({success:false, message:"Token doesn't have id"})
        }

        next();

    }catch(error){
        res.status(401).json({success: false,message: error.message})
    }
}

export default organisationAuth;