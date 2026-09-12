const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateHealthGuidance = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please describe your symptoms or health concern."
      });
    }

    const prompt = `
You are a patient health guidance assistant for an appointment booking application.

The patient has described:

"${message}"

Give simple, clear and helpful general health guidance.

Use this structure when relevant:

## What it could be related to

Explain possible general causes without diagnosing.

## What you can do now

Give safe general self-care suggestions.

## Food and hydration

Give simple food and hydration suggestions when relevant.

## What to tell your doctor

Mention useful information the patient should share.

## When to seek medical help

Clearly mention warning signs that require prompt medical attention.

IMPORTANT SAFETY RULES:

- Do NOT diagnose the patient.
- Do NOT claim that the patient has a specific disease.
- Do NOT prescribe medicines.
- Do NOT recommend specific medicines, doses or treatment plans.
- Do NOT tell the patient to stop or change prescribed medication.
- Do NOT replace a doctor's examination.
- If symptoms could have many causes, clearly explain that.
- If symptoms sound serious, recommend appropriate medical care.
- Keep the language simple and natural.
- Use short paragraphs and bullet points.
- Do not put everything into one large paragraph.

End with:

This information is for general guidance and is not a medical diagnosis.

Return only the health guidance response.
`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of response) {
      const text = chunk.text;

      if (text) {
        res.write(text);
      }
    }

    res.end();

  } catch (error) {
    console.error("Gemini API error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate health guidance"
      });
    } else {
      res.end();
    }
  }
};

module.exports = {
  generateHealthGuidance
};