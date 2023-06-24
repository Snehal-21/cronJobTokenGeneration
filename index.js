import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import router from "./routes/userRoutes.js";

const app=express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/cronjob',router);

mongoose.connect('mongodb+srv://Snehal:Snehal1234@mern-todo.va7rcii.mongodb.net/cronJob?retryWrites=true&w=majority')
.then(()=>console.log("Db connected."))
.catch((err)=>console.log("db error=>",err));

app.listen(4000,()=>console.log("Working on port"))
