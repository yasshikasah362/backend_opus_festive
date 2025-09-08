// models/Flyer.js
import mongoose from "mongoose";

const flyerSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  inputImageUrl: { type: String },
  flyerImage: { type: String, required: true }, // store base64
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Flyer", flyerSchema);
