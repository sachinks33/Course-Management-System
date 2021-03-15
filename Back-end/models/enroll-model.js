const mongoose= require("mongoose");
const Schema= mongoose.Schema;
//course model
const enrollSchema=new Schema({
    CourseId:String,
    userId:String,
    status:String
});
const enrollModel= mongoose.model("enrollData", enrollSchema );
module.exports=enrollModel;