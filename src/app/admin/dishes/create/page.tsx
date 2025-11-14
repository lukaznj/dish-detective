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
  Snackbar,
  Alert,
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
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { createDish } from "../actions";

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAdminDashboard = () => {
    router.push("/admin");
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddAllergen = () => {
    setAllergens([...allergens, ""]);
  };

  const handleRemoveAllergen = (index: number) => {
    setAllergens(allergens.filter((_, i) => i !== index));
  };

  const handleAllergenChange = (index: number, value: string) => {
    const newAllergens = [...allergens];
    newAllergens[index] = value;
    setAllergens(newAllergens);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    console.log("Form data:", {
      dishName,
      ingredients: ingredients.filter((ing) => ing.trim()),
      allergens: allergens.filter((alg) => alg.trim()),
      imageFile,
    });
    // TODO: Backend integration
  };

  

  if (isMobile) {
    return null;
  }

  const navWidth = 80;

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
                value = {dishName}
                onChange={(e) => setDishName(e.target.value)}
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
                component="label"
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
                {imageFile ? imageFile.name : "Upload image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
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
              {ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Unesite sastojak..."
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    sx={{
                      bgcolor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  {ingredients.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveIngredient(index)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddIngredient}
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
              {allergens.map((allergen, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Unesite alergen..."
                    value={allergen}
                    onChange={(e) => handleAllergenChange(index, e.target.value)}
                    sx={{
                      bgcolor: "background.paper",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  {allergens.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveAllergen(index)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAllergen}
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
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                py: 1.5,
                mb: 3,
                bgcolor: "grey.900",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Dodaj jelo
            </Button>
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
