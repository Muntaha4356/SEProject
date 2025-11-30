import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOTP: {type: String, default: ''},
    verifyOTPExpireAt: {type: Date, default: null},
    status :{type: Boolean, default: false},
    resetOtp : {type:String, default: ''},
    resetOptExpireAt: {type: Date, default: 0},
})



const userModel = mongoose.model("User", UserSchema)

export default userModel;