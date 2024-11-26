import express from "express";
import cors from "cors";
import mongoose from "mongoose";  
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();
const path = require("path");


const mongoURI = process.env.ATLAS_URI; 
mongoose.connect(mongoURI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.static("./client/dist"));
app.use("/record", records);
app.get("*",(req,res)=> {
  res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
})


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
