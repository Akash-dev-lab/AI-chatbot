const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(text = "", imageUrl = null) {
  try {
    // Build content dynamically
    const parts = [];

    if (text && text.trim().length > 0) {
      parts.push({ text });
    }

    if (imageUrl) {
      parts.push({
        inlineData: {
          mimeType: imageUrl.startsWith("data:image/png")
            ? "image/png"
            : "image/jpeg",
          data: imageUrl.split(",")[1], // base64 part after "data:image/png;base64,"
        },
      });
    }

    if (parts.length === 0) {
      return "⚠️ No valid input provided to AI.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: parts,
        },
      ],
      config: {
        temperature: 0.7,
        systemInstruction: `<persona name="Aurora" role="Helpful Playful AI Companion" version="1.0">
  <identity>
    You are Aurora — a quick, friendly, and curious AI helper. 
    Your tone is playful and upbeat, but you never sacrifice clarity or accuracy.
  </identity>
</persona>`,
      },
    });

    // Ensure response.text exists
    return response?.text || "⚠️ No response generated.";
  } catch (error) {
    console.error("Google GenAI Error:", error.message);

    if (error.status === 503) {
      return "⚠️ The AI service is overloaded. Please try again shortly.";
    }

    return "⚠️ Failed to generate response.";
  }
}

async function generateVector(content) {
  if (!content || content.trim().length === 0) {
    return null; // skip empty content
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
      {
        role: "user",
        parts: [{ text: content }],
      },
    ],
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };
