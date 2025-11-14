"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Page() {
  const { signUp, isLoaded } = useSignUp();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/sso-callback",
        redirectUrlComplete: "/auth/redirect",
      });
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("Greška prilikom prijave s Google računom");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/BackgroundMan.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          bgcolor: "white",
          borderRadius: 3,
          p: 4,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
          }}
        >
          Student login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleGoogleSignIn}
          disabled={loading || !isLoaded}
          startIcon={
            loading ? (
              <CircularProgress size={20} />
            ) : (
              <img
                src="/google_logo.svg.png"
                alt="Google"
                width="20"
                height="20"
                style={{ display: 'block' }}
              />
            )
          }
          sx={{
            py: 1.5,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 600,
            borderColor: "#dadce0",
            color: "#3c4043",
            "&:hover": {
              bgcolor: "#f8f9fa",
              borderColor: "#dadce0",
            },
          }}
        >
          {loading ? "Prijava..." : "Prijavi se s Google računom"}
        </Button>
      </Box>
    </Box>
  );
}
