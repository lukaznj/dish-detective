"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Dish {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import TuneIcon from "@mui/icons-material/Tune";
import CreateIcon from "@mui/icons-material/Create";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FileUpload } from "@mui/icons-material";

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  if (isMobile) {
    return null;
  }

  const navWidth = 80;

  const handleAdminDashboard = () => {
    router.push("/admin");
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Box
        component="nav"
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: navWidth,
          bgcolor: "common.white",
          boxShadow: "2px 0 8px rgba(0,0,0,0.12)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            p: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1} alignItems="center">
            <IconButton
              onClick={handleAdminDashboard}
              sx={{ color: "grey.900" }}
            >
              <HomeFilledIcon />
            </IconButton>
            <IconButton sx={{ color: "grey.900" }}>
              <TuneIcon />
            </IconButton>
            <IconButton
              sx={{
                color: "primary.dark",
                bgcolor: "grey.200",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            >
              <CreateIcon />
            </IconButton>
            <IconButton sx={{ color: "grey.900" }}>
              <PeopleIcon />
            </IconButton>
            <IconButton sx={{ color: "grey.900" }}>
              <ChatIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          //marginLeft: `${navWidth}px`,
          flexGrow: 1,
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            height: 80,
            minHeight: 80,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            zIndex: 20,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <img
              src="/logoWhite.png"
              alt="Dish Detective Logo"
              style={{ width: 36, height: 36 }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              Dish Detective
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleAdminDashboard}
            sx={{
              bgcolor: "success.light",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              mr: 2,
              boxShadow: 0,
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Admin
          </Button>
        </Box>

        <Typography
            marginLeft={`${navWidth}px`}
            variant="h4"
            fontWeight={780}
            sx={{ color: "#212222", p: 5, pb: 2 }}
          >
            Unesite podatke
          </Typography>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: `${navWidth}px`,
          }}
        >
            
          <Box sx={{ maxWidth: 500, width: "100%" }}>
            {/* Naziv jela */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 400, color: "text.primary" }}
              >
                Naziv jela
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="..."
                sx={{
                  bgcolor: "background.paper",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileUploadIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  placeholder: "Upload image",
                  py: 1.5,
                  borderColor: "grey.500",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Upload image
              </Button>
            </Box>

            {/* Sastojci */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 400, color: "text.primary" }}
              >
                Sastojci
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="..."
                sx={{
                  bgcolor: "background.paper",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: "grey.500",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              ></Button>
            </Box>

            {/* Alergeni */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 400, color: "text.primary" }}
              >
                Alergeni
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="..."
                sx={{
                  bgcolor: "background.paper",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: "grey.500",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              ></Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "primary.main",
            height: 50,
            width: "100%",
            mt: "auto",
            zIndex: 20,
            position: "relative",
            flexShrink: 0,
          }}
        />
      </Box>
    </Box>
  );
}
