const mongoose= require("mongoose");
const Schema= mongoose.Schema;
//course model
const courseSchema=new Schema({
    title:String,
    aim:String,
    duration:Number,
    requirement:String,
    content:String,
    description:String,
    image:String
});
const courseModel= mongoose.model("courseData", courseSchema );
module.exports=courseModel;