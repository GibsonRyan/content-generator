// LinkAccount.js
import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LinkAccount = () => {
  const navigate = useNavigate();
  const [isLinked, setIsLinked] = useState(false);

  const handleLinkFacebookAccount = async () => {
    // Link the Facebook account using the appropriate API
    // On successful linking, set isLinked to true
    setIsLinked(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">
          Link Facebook Account
        </Typography>
        <Box sx={{ width: "100%", marginTop: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLinkFacebookAccount}
            disabled={isLinked}
          >
            {isLinked ? "Account Linked" : "Link Facebook Account"}
          </Button>
          <Button fullWidth color="primary" onClick={() => navigate("/linked-accounts")}>
            Back to Linked Accounts
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LinkAccount;
