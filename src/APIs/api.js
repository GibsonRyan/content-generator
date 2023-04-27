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

export const sendChatHistory = async (chatHistory) => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const sub = currentUser.attributes.sub;

    const apiName = "SwiftAPI";
    const path = "/history";
    const data = {
      body: {
        userId: sub,
        type: "chatbot",
        history: chatHistory,
      },
    };

    await API.post(apiName, path, data);
    console.log("Chat history sent successfully");
  } catch (error) {
    console.error("Error sending chat history", error);
  }
};
