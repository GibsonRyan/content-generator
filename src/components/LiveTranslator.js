import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Typography, Grid, TextField, AppBar, Box, List, ListItem } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { fetchOpenAIResponse } from "../APIs/gpt";
import AWS from "aws-sdk";
import { Howl } from "howler";
import { textToSpeech } from "../APIs/textToSpeech";
import { uploadAudioToWhisper } from "../APIs/audio";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});
const Translate = () => {
  const [aiVoice, setAiVoice] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(chatHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const [audioPlayer, setAudioPlayer] = useState(null);

  const handleMicIconClick = async () => {
    if (audioPlayer) {
      audioPlayer.stop();
    }

    if (!isRecording) {
      startRecording();
    } else {
      await stopRecording();
    }
  };

  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const playAiVoice = async (responseText) => {
    if (aiVoice) {
      if (audioPlayer) {
        audioPlayer.stop();
      }
      const audioUrl = await textToSpeech(responseText, null);
      const player = new Howl({
        src: [audioUrl],
        html5: true,
        onend: () => console.log("Playback has finished."),
      });
      player.play();
      setAudioPlayer(player);
    }
  };

  const startTranslator = async () => {
    const prompt = `You are a translator that will provide translations for two people. 
                    You must start with the phrase, 'Which two languages should I translate?' 
                    then wait for me to tell you the two languages. Respond only with 'Okay, I'm ready to translate.' 
                    Then wait for me to give you text to translate. 
                    You translate word for word with no other text like so
                    Which two languages should I translate?
                    german and english
                    Okay, I'm ready to translate.
                    hallo, wie geht's
                    Hello, how are you?
                    I'm great! how are you?
                    Ich bin großartig! Wie geht's dir?`;
    const openAIResponse = await fetchOpenAIResponse(prompt, [], 'system');
    setChatHistory([{ role: "system", content: prompt }, { role: "assistant", content: openAIResponse }]);
    await playAiVoice(openAIResponse);
  };

  const handleSubmitResponse = async () => {
    const openAIResponse = await fetchOpenAIResponse(inputText, chatHistory, "user");

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: "user", content: inputText },
      { role: "assistant", content: openAIResponse },
    ]);

    setInputText("");
    await playAiVoice(openAIResponse);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const transcript = await uploadAudioToWhisper(blob);
      setInputText(transcript);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    startTranslator();
  }, []);

  useEffect(() => {
    chatHistoryRef.current = chatHistory; // Update the ref whenever chatHistory changes
  }, [chatHistory]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Live Translator</Typography>
        </Grid>
        <Grid item xs={12}>
          <AppBar position="static" color="primary">
            <Grid container alignItems="center" justifyContent="center">
              <RecordVoiceOverIcon
                sx={{
                  fontSize: "3rem",
                }}
              />
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: "background.dark",
              borderRadius: 1,
              padding: 2,
              height: "50vh",
              overflowY: "auto",
            }}
          >
            <List>
              {chatHistory.slice(1).map((message, index) => (
                <ListItem key={index}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: message.role === "assistant" ? "info.main" : "white",
                    }}
                  >
                    {message.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="stretch">
            <Grid item xs={9}>
              <TextField
                fullWidth
                multiline
                InputLabelProps={{ style: { color: 'white' } }}
                label="Type your message"
                value={inputText}
                onChange={handleInputTextChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleSubmitResponse}
                style={{ height: '100%' }}
              >
                Translate
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <MicIcon
              onClick={handleMicIconClick}
              sx={{
                color: isRecording ? 'secondary.main' : 'grey.400',
                '&:hover': { color: 'white' },
                cursor: 'pointer',
                fontSize: "5rem",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container >
  );
};

export default Translate;

