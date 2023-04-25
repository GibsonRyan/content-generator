import React from "react";
import {Box, Button, Container, CssBaseline, Grid, List, ListItemIcon, ListItemText, ListItemButton, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SchoolIcon from '@mui/icons-material/School';
import { Auth } from "aws-amplify";

const Layout = () => {
  const [userName, setUserName] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserName(`${user.attributes.given_name} ${user.attributes.family_name}`);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
  
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <Grid container sx={{ display: "flex", bgcolor: "secondary.main", height: '100vh' }}>
      <CssBaseline />
      <Grid item
        sx={{ width: "100%", height: 64, position: "fixed", background: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.primary.contrastText }}
      >
        <Toolbar>
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold'}}>
            SwiftReach
          </Typography>
          <Typography variant="subtitle1" noWrap component="div" sx={{ marginRight: "16px" }}>
            {userName}
          </Typography>
          <Button color="secondary" variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </Toolbar>
      </Grid>
      <Grid
        item
        sx={{
          width: 240,
          height: "calc(100% - 64px)",
          position: "fixed",
          top: 64,
          background: "#282c34",
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/lessons")}>
              <ListItemIcon>
                <SchoolIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Lessons" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/chatbot")}>
              <ListItemIcon>
                <ChatBubbleIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Conversations" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/live-translate")}>
              <ListItemIcon>
                <RecordVoiceOverIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Live Translator" />
            </ListItemButton>
          </List>
        </Box>
      </Grid>
      <Grid
        item
        sx={{
          flexGrow: 1,
          marginLeft: '240px',
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Grid>
    </Grid>
  );
};

export default Layout;
