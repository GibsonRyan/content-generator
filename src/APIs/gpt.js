// openaiHelper.js
import openai from "openai";

openai.apiKey = process.env.OPENAI_API_KEY;

export const fetchOpenAIResponse = async (prompt) => {
  try {
    const response = await openai.Completion.create({
      engine: "davinci-codex",
      prompt: prompt,
      max_tokens: 4096,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].text.trim();
    } else {
      throw new Error("No response received from the OpenAI API");
    }
  } catch (error) {
    console.error("Error fetching OpenAI API response:", error);
    return null;
  }
};
