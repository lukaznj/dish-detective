"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: "url(/loginBackground.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            my: 3,
            textAlign: "center",
          }}
        >
          Zaposlenik login
        </Typography>

        <SignIn
          appearance={{
            elements: {
              socialButtonsBlockButton: {
                display: "none",
              },
              dividerRow: {
                display: "none",
              },
              footer: {
                display: "none",
              },
              headerSubtitle: {
                display: "none",
              },
              button: {
                fontSize: "1rem",
              },
              formButtonPrimary: {
                backgroundColor: "#2869e8",
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#49247A",
                },
              },
            },
          }}
          routing="path"
          path="/login/employee"
          signUpUrl="/login/employee"
          forceRedirectUrl="/auth/redirect"
        />
      </Box>
    </Box>
  );
}
