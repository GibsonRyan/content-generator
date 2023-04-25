// openaiHelper.js
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  organization: "org-G3FPFBv5pNTvhDynPn9CYhH7",
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

delete configuration.baseOptions.headers['User-Agent']
const openai = new OpenAIApi(configuration);

export const fetchOpenAIResponse = async (prompt, chatHistory, role) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...chatHistory, {"role": role, "content": prompt}],
      temperature: 0.5,
    });
    console.log(response)

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error("No response received from the OpenAI API");
    }
  } catch (error) {
    console.error("Error fetching OpenAI API response:", error);
    return null;
  }
};
