import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST new item
router.post("/", async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

// UPDATE item
router.put("/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(item);
});

// DELETE item
router.delete("/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
