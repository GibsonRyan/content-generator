import axios from "axios";

export const uploadAudioToWhisper = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");
  try {
    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.text;
  } catch (error) {
    console.error("Error uploading audio to Whisper", error);
  }
};
