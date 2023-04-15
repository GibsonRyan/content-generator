import { Polly } from "aws-sdk";

export const textToSpeech = async (text, language) => {
  const voiceMapping = {
    spanish: "Conchita",
    french: "Celine",
    german: "Marlene",
  };

  const polly = new Polly({
    apiVersion: "2016-06-10",
    region: process.env.REACT_APP_AWS_REGION,
  });

  const params = {
    OutputFormat: "mp3",
    SampleRate: "16000",
    Text: text,
    TextType: "text",
    VoiceId: voiceMapping[language] || "Joanna",
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();
    const audioUrl = URL.createObjectURL(new Blob([data.AudioStream]));
    return audioUrl;
  } catch (error) {
    console.error("Error synthesizing speech", error);
  }
};
