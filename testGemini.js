import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
console.log('api key is',process.env.GOOGLE_API_KEY);

async function testGemini() {
  try {
    // Replace with a very simple prompt
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = [{ text: "Generate a simple image of a red apple on a white background" }];

    const result = await model.generateContent({
      contents: prompt
    });

    const response = await result.response;

    console.log("Gemini response:", response);

    if (response?.images?.length > 0) {
      console.log("✅ Image generation succeeded!");
    } else {
      console.log("⚠️ No image returned.");
    }
  } catch (error) {
    console.error("❌ Error testing Gemini:", error);
  }
}

testGemini();
