import express from "express";
import cors from "cors";
import mongoose from "mongoose";  
import records from "../routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

const mongoURI = process.env.ATLAS_URI; 
mongoose.connect(mongoURI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json())
app.use("/record", records);
app.get("/",(req,res)=>res.status(200).json({message: "Hello World"}));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
