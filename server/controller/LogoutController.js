export const Logout = async (req, res)=>{
    try{
        res.clearCookie('token', { //'token' here is the name of the token that we are deleting
            httpOnly : true,
                secure: process.env.NODE_ENV === 'production', //if NODE_ENV is in production... it's true else, it's false
                sameSite: process.env.NODE_ENV=== 'production' ? 'none' : 'strict', //strict: if same server i.e. local host, none: if different environment
                
            
        })
        return res.json({success : true, message:"Logged Out successfully"})
    }catch(e){
        res.json({success: false, message: error.message})
    }
}