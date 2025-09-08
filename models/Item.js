import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  backgroundName: { type: String, required: true },
  category: { type: String, required: true },
 tags: { type: [String], default: [] },
  defaultPosition: { type: String }, // Store JSON as string
  baseUrl: { type: String },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
