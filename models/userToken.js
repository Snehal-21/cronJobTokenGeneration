import mongoose from "mongoose";
import { Schema } from "mongoose";

const usertoken=new Schema({
    token:String
});

export default mongoose.model("UserToken",usertoken);