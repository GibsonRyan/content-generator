import React from "react";
import { Button, Container, Typography, Grid, Select, MenuItem, InputLabel, FormControl, AppBar, TextField, Switch, FormControlLabel, Box } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import MicIcon from "@mui/icons-material/Mic";
import { fetchOpenAIResponse } from "../APIs/gpt";
import { API } from "aws-amplify";

const Chatbot = () => {
  const [language, setLanguage] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [aiVoice, setAiVoice] = React.useState(true);
  const [inputText, setInputText] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");


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
    const openAIResponse = await fetchOpenAIResponse(prompt);
    setChatHistory([{ sender: "chatbot", message: openAIResponse }]);
  };

  const handleSubmitResponse = async () => {
    const openAIResponse = await fetchOpenAIResponse(inputText);

    // Update the chat history with the user's message and the API response
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: "user", message: inputText },
      { sender: "chatbot", message: openAIResponse },
    ]);

    // Clear the input field
    setInputText("");
  };

  const getPrompt = async (language, topic) => {
    const apiName = 'yourApiName';
    const path = '/prompts';
    const queryParams = {
      queryStringParameters: {
        language: language,
        topic: topic,
      },
    };
    const response = await API.get(apiName, path, queryParams);
    console.log(response);
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
              <MenuItem sx={{ color: 'black' }} value="es">Spanish</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="fr">French</MenuItem>
              <MenuItem sx={{ color: 'black' }} value="gm">German</MenuItem>
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
              <Button color="secondary" variant="contained" onClick={startChatbot}>
                Start Chatbot
              </Button>
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
                  fontSize: "3rem", // Increase the FaceIcon size by adjusting the fontSize value
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
            {/* Render the chatbot text here */}
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
              <MicIcon />
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
