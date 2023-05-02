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
import { useNavigate } from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { getChatHistory } from '../APIs/api';

const Dashboard = () => {
  const [chatHistory, setChatHistory] = useState({
    chatbot: [],
    lesson: [],
    translation: [],
  });

  useEffect(() => {
    const fetchHistory = async () => {
      const fetchedHistory = await getChatHistory();
      setChatHistory(fetchedHistory);
    };

    fetchHistory();
  }, []);

  const navigate = useNavigate();

  const handleClick = (component, item) => {
    navigate(component, { state: { item } });
  };

  const renderHistoryItems = (historyArray, component) => {
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
                onClick={() => handleClick(component, item)}
                sx={{
                  width: '100%',
                  borderBottom: '1px solid',
                  borderColor: 'white',
                }}
              >
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item xs={2}>
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
                  </Grid>
                  <Grid item xs={10}>
                    <List>
                      <Grid container justifyContent="space-between" spacing={2}>
                        {lastTwoMessages.map((message, idx) => (
                          <Grid item>
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
                          </Grid>
                        ))}
                      </Grid>
                    </List>
                  </Grid>
                </Grid>
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
        <Grid item sm={12} lg={6}>
          <AppBar position="static" color="secondary">
            <Grid container alignItems="center" justifyContent="center">
              <SchoolIcon
                sx={{
                  fontSize: '3rem',
                }}
              />
              <Typography variant="h6" marginLeft={2}>Lessons History</Typography>
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              borderRadius: 1,
              padding: 2,
              height: '75vh',
              overflowY: 'auto',
            }}
          >
            <List>{renderHistoryItems(chatHistory.lesson, '/lessons')}</List>
          </Box>
        </Grid>
        <Grid item sm={12} lg={6}>
          <AppBar position="static" color="secondary">
            <Grid container alignItems="center" justifyContent="center">
              <ChatBubbleIcon
                sx={{
                  fontSize: '3rem',
                }}
              />
              <Typography variant="h6" marginLeft={2}>Conversations History</Typography>
            </Grid>
          </AppBar>
          <Box
            sx={{
              backgroundColor: 'background.dark',
              borderRadius: 1,
              padding: 2,
              height: '75vh',
              overflowY: 'auto',
            }}
          >
            <List>{renderHistoryItems(chatHistory.chatbot, '/chatbot')}</List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
