const mongoose= require("mongoose");
const Schema= mongoose.Schema;

//new schema & model
const userSchema = new Schema({
    userName:{type:String, required:[true, "Name field is required"]},
    email:{type:String, required:[true, "email field is required"]},
    mobile:{type: Number},
    userType:{type: String},
    password:{type:String}
});

const userModel= mongoose.model("userData", userSchema);

module.exports=userModel;