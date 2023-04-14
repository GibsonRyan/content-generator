// openaiHelper.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-G3FPFBv5pNTvhDynPn9CYhH7",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const fetchOpenAIResponse = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      engine: "gpt-3.5-turbo",
      prompt: prompt,
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
