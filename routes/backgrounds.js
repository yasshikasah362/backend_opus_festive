import express from "express";
import Item from "../models/Item.js"; 
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Item.find(); 

    console.log("✅ Items from MongoDB:", items); // <-- ye line add karo

    res.json(items);
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
