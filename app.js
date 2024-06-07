const express=require("express");
const route=require("./route")
const app=express();
app.listen(3000,()=>{
    console.log("server is running");
});