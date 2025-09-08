"use strict";
import express from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import fetch from "node-fetch";


const router = express.Router();

// ✅ Initialize Google AI client
// Make sure your API key is valid and has access to Gemini models
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCI-i0VzHHW4ilMn5FWwylR2hTKDKJJKgI",
});

// Helper: convert image URL to base64
async function urlToBase64(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

router.post("/generate-template", async (req, res) => {
  try {
    const { imageUrl, prompt_settings } = req.body;

    if (!imageUrl || !prompt_settings) {
      return res.status(400).json({ error: "Missing imageUrl or prompt_settings" });
    }

    // Convert image URL to base64
    const base64Image = await urlToBase64(imageUrl);

    // Prepare contents for Gemini
    const contents = [
      {
        inlineData: {
          mimeType: "image/png", // or "jpeg" depending on the input image
          data: base64Image,
        },
      },
      {
        text: JSON.stringify(prompt_settings),
      },
    ];

    // ✅ Generate image using Gemini 2.5 flash image-preview model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents:contents,
      
      
    });
    console.log('response from api',response);

    // Extract generated image from Gemini response
    let generatedImageBase64 = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) generatedImageBase64 = part.inlineData.data;
    }

    if (!generatedImageBase64) {
      return res.status(500).json({ error: "No image returned from Gemini" });
    }

    // Return image as base64 URL
    res.json({ generatedImage: `data:image/png;base64,${generatedImageBase64}` });
  } catch (err) {
    console.error("🔥 Error generating template:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
