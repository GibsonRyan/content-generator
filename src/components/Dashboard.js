import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  AppBar,
  Box,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { getChatHistory } from '../APIs/api';

const Dashboard = () => {
  const [history, setHistory] = useState({
    chatbot: [],
    lesson: [],
    translation: [],
  });

  useEffect(() => {
    const fetchHistory = async () => {
      const fetchedHistory = await getChatHistory();
      setHistory(fetchedHistory);
    };

    fetchHistory();
  }, []);

  const handleClick = (itemId, messages) => {
    console.log('Item ID:', itemId, 'Messages:', messages);
  };

  const renderHistoryItems = (historyArray) => {
    if (!historyArray) return null;
    return historyArray.map((item, index) => {
      if (item.history) {
        const messages = item.history;
        const filteredMessages = messages.filter(
          (message) => message.role !== 'system'
        );
        const lastTwoMessages = filteredMessages.slice(-2);
        return (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemButton
                onClick={() => handleClick(item.id, messages)}
                sx={{
                  width: '100%',
                  borderBottom: '1px solid',
                  borderColor: 'white',
                }}
              >
                <ListItem>
                  <Typography
                    variant="body1"
                    sx={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      paddingRight: '16px',
                    }}
                  >
                    {item.date}
                  </Typography>
                </ListItem>
                <List>
                  {lastTwoMessages.map((message, idx) => (
                    <ListItem key={idx} disablePadding>
                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            message.role === 'assistant'
                              ? 'info.main'
                              : 'white',
                        }}
                      >
                        {message.content}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        );
      }
      return null;
    });
  };




  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Dashboard</Typography>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="secondary">
            <Grid container alignItems="center" justifyContent="center">
              <SchoolIcon
                sx={{
                  fontSize: '3rem',
                }}
              />
              <Typography variant="h6">Lessons</Typography>
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              borderRadius: 1,
              padding: 2,
              height: '50vh',
              overflowY: 'auto',
            }}
          >
            <List>{renderHistoryItems(history.lesson)}</List>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="secondary">
            <Grid container alignItems="center" justifyContent="center">
              <ChatBubbleIcon
                sx={{
                  fontSize: '3rem',
                }}
              />
              <Typography variant="h6">Conversations</Typography>
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              borderRadius: 1,
              padding: 2,
              height: '50vh',
              overflowY: 'auto',
            }}
          >
            <List>{renderHistoryItems(history.chatbot)}</List>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="secondary">
            <Grid container alignItems="center" justifyContent="center">
              <RecordVoiceOverIcon
                sx={{
                  fontSize: '3rem',
                }}
              />
              <Typography variant="h6">Live Translator</Typography>
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              borderRadius: 1,
              padding: 2,
              height: '50vh',
              overflowY: 'auto',
            }}
          >
            <List>{renderHistoryItems(history.translation)}</List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
