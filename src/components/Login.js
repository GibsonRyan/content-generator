import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [cognitoUser, setCognitoUser] = useState(null);

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cognitoUser) {
        await Auth.completeNewPassword(cognitoUser, newPassword);
        setNewPasswordRequired(false); // Reset the newPasswordRequired state
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(email, password);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        setNewPasswordRequired(true);
        setCognitoUser(user); // Set the cognitoUser state
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box bgcolor="background.default" sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5" color={'primary'}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: "50%", marginTop: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
      {newPasswordRequired && (
        <form onSubmit={handleNewPasswordSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit">Submit New Password</Button>
        </form>
      )}
    </Box>


  );
};

export default Login;
