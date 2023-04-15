import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Typography, Grid, Select, MenuItem, InputLabel, FormControl, AppBar, TextField, Switch, FormControlLabel, Box, CircularProgress, List, ListItem } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from '@mui/icons-material/MicOff';
import { fetchOpenAIResponse } from "../APIs/gpt";
import { API } from "aws-amplify";
import axios from "axios";
import formData from "form-data";

const Chatbot = () => {
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [aiVoice, setAiVoice] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);

  const handleMicIconClick = async () => {
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

  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const startChatbot = async () => {
    const openAIResponse = await fetchOpenAIResponse(prompt, [], 'system');
    setChatHistory([{ role: "system", content: prompt }, { role: "assistant", content: openAIResponse }]);
    console.log(chatHistory)
  };

  const handleSubmitResponse = async () => {
    const openAIResponse = await fetchOpenAIResponse(inputText, chatHistory, 'user');

    // Update the chat history with the user's content and the API response
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: "user", content: inputText },
      { role: "assistant", content: openAIResponse },
    ]);

    // Clear the input field
    setInputText("");
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

  const uploadAudioToWhisper = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      return response.data.text;
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    const fetchPrompt = async () => {
      if (language && topic) {
        setIsLoading(true);
        await getPrompt(language, topic);
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [language, topic]);

  const getPrompt = async (language, topic) => {
    const apiName = 'SwiftReachAPI';
    const path = '/prompt';
    const queryParams = {
      queryStringParameters: {
        language: language,
        topic: topic,
      },
    };
    const response = await API.get(apiName, path, queryParams);
    setPrompt(response[0].prompt);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Chatbot</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Select Language</InputLabel>
            <Select value={language} onChange={handleLanguageChange}>
              {/* Add available languages as MenuItems here */}
              <MenuItem sx={{ color: 'black' }} value="spanish">Spanish</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="french">French</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="german">German</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Select Topic</InputLabel>
            <Select value={topic} onChange={handleTopicChange}>
              {/* Add available topics as MenuItems here */}
              <MenuItem sx={{ color: 'black' }} value="sports">Sports</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="science">Science</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="technology">Technology</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="school">School</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="restaurant">Restaurant</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="pets">Pets</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="grocery checkout">Grocery Checkout</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="getting directions">Getting Directions</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="hobbies">Hobbies</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="improvise">Improvise</MenuItem>
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
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs>
              <TextField
                fullWidth
                multiline
                InputLabelProps={{ style: { color: 'white' } }}
                label="Type your message"
                value={inputText}
                onChange={handleInputTextChange}
              />
            </Grid>
            <Grid item>
              {isRecording ? (
                <MicOffIcon onClick={handleMicIconClick} />
              ) : (
                <MicIcon onClick={handleMicIconClick} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmitResponse}
          >Submit response</Button>
        </Grid>
      </Grid>
    </Container >
  );
};

export default Chatbot;
