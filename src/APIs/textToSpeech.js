const franc = require('franc');
const langs = require('langs');
const Polly = require('aws-sdk/clients/polly');

export const textToSpeech = async (text, language = null) => {
  const voiceMapping = {
    es: "Conchita", 
    fr: "Celine", 
    de: "Marlene", 
  };

  if (!language) {
    const detectedLanguage = franc(text);
    const languageInfo = langs.where('3', detectedLanguage);
    language = languageInfo && languageInfo['1'];
  }

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
