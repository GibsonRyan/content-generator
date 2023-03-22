import React from "react";
import { AppBar, Box, Button, Container, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform your logout logic here and redirect to the login page
    navigate("/login");
  };

  return (
    <Box bgcolor="secondary.main" sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Product Name
          </Typography>
          <Typography variant="subtitle1" noWrap component="div">
            User Name
          </Typography>
          <Button color="secondary" variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", background: "#a0a8b6" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/analytics")}>
              <ListItemIcon>
                <BarChartIcon style={{ color: "White"}}/>
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          {/* Add your main content here */}
          <Typography variant="h4">Posts</Typography>
          {/* Render the list of user posts */}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
