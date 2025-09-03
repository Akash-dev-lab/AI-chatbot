const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  try {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });
  return response.text
  } catch (error) {
    console.error("Google GenAI Error:", error.message);

    if (error.status === 503) {
      // Retry logic or custom fallback
      return "⚠️ The AI service is overloaded. Please try again shortly.";
    }

    throw error;
  }
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768
    }
  })

  return response.embeddings[0].values
} 

module.exports = {generateResponse, generateVector}