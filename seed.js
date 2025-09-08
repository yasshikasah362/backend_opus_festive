import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/Item.js";
import { backgroundPositions } from "./data/backgroundPositions.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear old data (optional)
    await Item.deleteMany();

    // Insert seed data
    await Item.insertMany(backgroundPositions);

    console.log("✅ Data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    process.exit(1);
  }
};

seedData();
