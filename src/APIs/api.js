import { API, Auth } from "aws-amplify";

export const getPrompt = async (language, topic) => {
  const apiName = "SwiftAPI";
  const path = "/prompt";
  const queryParams = {
    queryStringParameters: {
      language: language,
      topic: topic,
    },
  };
  const response = await API.get(apiName, path, queryParams);
  return response[0].prompt;
};

export const sendChatHistory = async (date, chatHistory, chatType, language, topic, difficulty = null, chatId = null) => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const sub = currentUser.attributes.sub;

    const apiName = "SwiftAPI";
    const path = "/history";
    const data = {
      body: {
        userId: sub,
        type: chatType,
        history: chatHistory,
        id: chatId,
        language: language,
        topic: topic,
        difficulty: difficulty,
        date: date,
      },
    };

    await API.post(apiName, path, data);
    console.log("Chat history sent successfully");
  } catch (error) {
    console.error("Error sending chat history", error);
  }
};

export const getChatHistory = async () => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const userId = currentUser.attributes.sub;

    const apiName = "SwiftAPI";
    const path = "/history";
    const queryParams = {
      queryStringParameters: {
        userId: userId,
      },
    };

    const response = await API.get(apiName, path, queryParams);
    console.log("Chat history retrieved successfully", response);

    const chatbotHistory = [];
    const lessonHistory = [];
    const translationHistory = [];

    response.forEach((item) => {
      if (item.type === "chatbot") {
        chatbotHistory.push(item);
      } else if (item.type === "lesson") {
        lessonHistory.push(item);
      } else if (item.type === "translation") {
        translationHistory.push(item);
      }
    });

    return {
      chatbot: chatbotHistory,
      lesson: lessonHistory,
      translation: translationHistory
    };
  } catch (error) {
    console.error("Error retrieving chat history", error);
    return {
      chatbot: [],
      lesson: [],
      translation: []
    };
  }
};

