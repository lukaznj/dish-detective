"use client";

import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PancakeStackLoader from "@/components/PancakeStackLoader";

interface SuccessScreenProps {
  message: string;
  showLoader?: boolean;
}

export default function SuccessScreen({
  message,
  showLoader = true
}: SuccessScreenProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        gap: 3,
      }}
    >
      {showLoader && <PancakeStackLoader />}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: showLoader ? 0 : 4,
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "#4caf50",
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#4caf50",
            textAlign: "center",
            px: 3,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

