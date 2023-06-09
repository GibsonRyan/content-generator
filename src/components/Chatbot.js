import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Typography, Grid, Select, MenuItem, InputLabel, FormControl, AppBar, TextField, Switch, FormControlLabel, Box, CircularProgress, List, ListItem } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { fetchOpenAIResponse } from "../APIs/gpt";
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AWS from "aws-sdk";
import { useLocation } from "react-router-dom";
import { Howl } from "howler";
import { getPrompt, sendChatHistory } from "../APIs/api";
import { uploadAudioToWhisper } from "../APIs/audio";
import { textToSpeech } from "../APIs/textToSpeech";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const Chatbot = () => {
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [aiVoice, setAiVoice] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(chatHistory);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const location = useLocation();
  const conversation = location.state?.item;

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

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleAiVoiceChange = (event, newAiVoice) => {
    if (newAiVoice !== null) {
      setAiVoice(newAiVoice);
    }
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitResponse();
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
      const audioUrl = await textToSpeech(responseText, language);
      const player = new Howl({
        src: [audioUrl],
        html5: true, // Add this line to force HTML5 Audio, it might help with playback issues
        onend: () => console.log("Playback has finished."),
      });
      player.play();
      setAudioPlayer(player);
    }
  };

  const startChatbot = async () => {
    const openAIResponse = await fetchOpenAIResponse(prompt, [], 'system');
    setChatHistory([{ role: "system", content: prompt }, { role: "assistant", content: openAIResponse }]);
    await playAiVoice(openAIResponse);
  };

  const handleSubmitResponse = async () => {
    const openAIResponse = await fetchOpenAIResponse(inputText, chatHistory, "user");

    // Update the chat history with the user's content and the API response
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
    console.log(conversation);
    if (conversation) {
      setLanguage(conversation.language);
      setTopic(conversation.topic);
      setChatHistory(conversation.history)
    }
  }, [conversation]);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (language) {
        setIsLoading(true);
        setPrompt(await getPrompt(language, 'conversation'));
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [language, topic]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory; // Update the ref whenever chatHistory changes
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      // This function will be called when the component is unmounted
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      sendChatHistory(formattedDate, chatHistoryRef.current, 'chatbot', language, topic, null, conversation?.id ?? null);
    };
  }, []); // Pass an empty array as the dependency to run the cleanup function only on unmount

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Conversation Simulator</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Select Language</InputLabel>
            <Select value={language} onChange={handleLanguageChange}>
              {/* Add available languages as MenuItems here */}
              <MenuItem sx={{ color: 'black' }} value="es">Spanish</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="fr">French</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="de">German</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                onClick={startChatbot}
                disabled={!prompt || isLoading}
              >
                Start Chatbot
              </Button>
              {isLoading && <CircularProgress size={24} />}
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={aiVoice}
                    onChange={handleAiVoiceChange}
                    color="secondary"
                  />
                }
                label="AI Voice"
              />
              <Tooltip
                title="Disclaimer: The AI voice will be optimized for the Chatbot's selected language, not English"
                placement="right"
                arrow
              >
                <InfoOutlinedIcon sx={{ color: 'primary.main', marginLeft: 1, cursor: 'pointer' }} />
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AppBar position="static" color="primary">
            <Grid container alignItems="center" justifyContent="center">
              <FaceIcon
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
              height: "30vh",
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
                onKeyPress={handleInputKeyPress}
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
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            {isRecording ? (
              <StopIcon
                onClick={handleMicIconClick}
                sx={{
                  color: 'secondary.main',
                  '&:hover': { color: 'white' },
                  cursor: 'pointer',
                  fontSize: "5rem",
                }}
              />
            ) : (
              <MicIcon
                onClick={handleMicIconClick}
                sx={{
                  color: 'grey.400',
                  '&:hover': { color: 'white' },
                  cursor: 'pointer',
                  fontSize: "5rem",
                }}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container >
  );
};

export default Chatbot;
