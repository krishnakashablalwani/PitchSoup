import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

export async function generateContentWithFallback(
  prompt: string,
  modelName: string = "gemini-2.5-flash",
  groqModel: string = "openai/gpt-oss-120b"
): Promise<string> {
  let text = "";
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    text = result.response.text().trim();
  } catch (error: any) {
    const errorStr = String(error).toLowerCase();
    if (
      error.status === 503 ||
      error.status === 429 ||
      errorStr.includes("503") ||
      errorStr.includes("429") ||
      errorStr.includes("overloaded") ||
      errorStr.includes("unavailable") ||
      errorStr.includes("too many requests") ||
      errorStr.includes("quota exceeded")
    ) {
      console.log("Gemini error (503/429/Quota), falling back to Groq...");
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: groqModel,
      });
      text = chatCompletion.choices[0]?.message?.content?.trim() || "";
    } else {
      throw error;
    }
  }
  return text;
}
