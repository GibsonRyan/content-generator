import React from 'react';
import {
  Container,
  Typography,
  Grid,
  AppBar,
  Box,
  List,
  ListItem,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

const Dashboard = () => {
  const dummyRows = [
    { title: 'Dummy Row 1' },
    { title: 'Dummy Row 2' },
    { title: 'Dummy Row 3' },
  ];

  const renderDummyRows = () => {
    return dummyRows.map((row, index) => (
      <ListItem key={index}>
        <Typography variant="body1">{row.title}</Typography>
      </ListItem>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Dashboard</Typography>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="primary">
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
            <List>{renderDummyRows()}</List>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="primary">
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
            <List>{renderDummyRows()}</List>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} lg={4}>
          <AppBar position="static" color="primary">
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
            <List>{renderDummyRows()}</List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
