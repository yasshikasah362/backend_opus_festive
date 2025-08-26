import express from "express";
import cors from "cors";
import { GoogleGenAI,Modality  } from "@google/genai";
import dotenv from "dotenv";
// import fs from "fs";
import mongoose from "mongoose";
import Flyer from "./models/Flyer.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Create client instance ONCE
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Helper: convert image URL to base64
async function urlToBase64(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

app.post("/api/generateFlyer", async (req, res) => {
  try {
    const { prompt, inputImageUrl } = req.body;
    if (!prompt || !inputImageUrl) {
      return res.status(400).json({ error: "Missing prompt or inputImageUrl" });
    }

    console.log("Received prompt and image:", { prompt, inputImageUrl });

    const base64Image = await urlToBase64(inputImageUrl);

    const contents = [
      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      { text: prompt },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents,
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });

    let generatedImageBase64 = null;
    let mimeType = "image/png";

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        generatedImageBase64 = part.inlineData.data;
      }
    }

    if (!generatedImageBase64) {
      return res.status(500).json({ error: "No image returned from Gemini" });
    }

    // ✅ Save to MongoDB
    const flyer = new Flyer({
      prompt,
      inputImageUrl,
      flyerImage: `data:${mimeType};base64,${generatedImageBase64}`,
    });

    await flyer.save();

    res.json({
      message: "✅ Flyer generated and saved",
      flyerId: flyer._id,
      flyerImage: flyer.flyerImage,
    });

  } catch (err) {
    console.error("🔥 Error in /api/generateFlyer:", err);
    res.status(500).json({ error: "Failed to generate flyer", details: err.message });
  }
});


//mongodb connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

//reteriveing the generateed flyer
app.get("/api/flyers/:id", async (req, res) => {
  try {
    const flyer = await Flyer.findById(req.params.id);
    if (!flyer) return res.status(404).json({ error: "Flyer not found" });
    res.json(flyer);
  } catch (err) {
    res.status(500).json({ error: "Error fetching flyer" });
  }
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
