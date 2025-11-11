"use client";

import { Box, Typography, Button } from "@mui/material";

import { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const ActionButton = ({ children, onClick }: ActionButtonProps) => (
  <Button
    variant="outlined"
    fullWidth
    onClick={onClick}
    sx={{
      textTransform: "none",
      fontSize: "1.25rem",
      fontWeight: "600",
      padding: "20px 15px",
      borderRadius: "8px",
      borderColor: "rgba(0, 0, 0, 0.23)",
      color: "text.primary",
      "&:hover": {
        borderColor: "primary.main",
      },
      mb: 3,
    }}
  >
    {children}
  </Button>
);

export default function Page() {
  const handleActionClick = (action: string) => {
    console.log(`Kliknuta akcija: ${action}`);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        justifyContent: "flex-start",
        pt: 4,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          flexGrow: 0,
          maxWidth: 600,
          mx: "auto",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.25rem" },
          }}
        >
          Izaberite akciju
        </Typography>

        <Box>
          <ActionButton onClick={() => handleActionClick("restorani")}>
            Upravljaj restoranima
          </ActionButton>
          <ActionButton onClick={() => handleActionClick("jelima")}>
            Upravljaj jelima
          </ActionButton>
          <ActionButton onClick={() => handleActionClick("racunima")}>
            Upravljaj računima
          </ActionButton>
        </Box>
      </Box>
    </Box>
  );
}
