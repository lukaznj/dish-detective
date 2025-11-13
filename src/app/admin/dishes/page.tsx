"use client";

import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Divider,
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

import DishCard from "@/components/DishCard";
import AddIcon from "@mui/icons-material/Add";
import { getAllDishes, deleteDish, createDish } from "./Actions";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import TuneIcon from "@mui/icons-material/Tune";
import CreateIcon from "@mui/icons-material/Create";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";

const dishNames = [
  "Margherita Pizza",
  "Caesar Salad",
  "Spaghetti Carbonara",
  "Beef Burger",
  "Chicken Tikka Masala",
  "Pad Thai",
  "Sushi Roll",
  "Fish and Chips",
  "Tacos al Pastor",
  "Ramen Bowl",
  "Grilled Salmon",
  "Greek Salad",
  "BBQ Ribs",
  "Penne Arrabbiata",
  "Chicken Wings",
  "Tom Yum Soup",
  "Beef Stew",
  "Mushroom Risotto",
  "Lamb Chops",
  "Falafel Wrap",
];

const descriptions = [
  "A delicious and savory dish",
  "Fresh ingredients cooked to perfection",
  "Traditional recipe with a modern twist",
  "Authentic flavors from around the world",
  "Chef's special recommendation",
  "Popular customer favorite",
  "Made with locally sourced ingredients",
  "A classic comfort food",
  "Perfectly seasoned and grilled",
  "Rich and flavorful",
];

const categories = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Soup",
  "Salad",
  "Pasta",
  "Seafood",
  "Vegetarian",
  "Grill",
  "Asian",
];

const allergensList = [
  ["Gluten", "Dairy"],
  ["Nuts", "Eggs"],
  ["Shellfish"],
  ["Soy"],
  ["Dairy", "Eggs"],
  [],
  ["Gluten"],
  ["Nuts", "Dairy"],
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    setLoading(true);
    const response = await getAllDishes();

    if (response.success && response.data) {
      setDishes(response.data);
    } else {
      console.error("Failed to load dishes:", response.message);
    }
    setLoading(false);
  };

  const handleAddDish = async () => {
    const randomDish = {
      name: getRandomElement(dishNames),
      description: getRandomElement(descriptions),
      category: getRandomElement(categories),
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      allergens: getRandomElement(allergensList),
    };

    const response = await createDish(randomDish);

    if (response.success) {
      loadDishes();
    } else {
      console.error("Failed to create dish:", response.message);
      alert("Failed to create dish: " + response.message);
    }
  };

  const handleDeleteDish = async (id: string) => {
    const response = await deleteDish(id);

    if (response.success) {
      setDishes(dishes.filter((dish) => dish._id !== id));
    } else {
      console.error("Failed to delete dish:", response.message);
      alert("Failed to delete dish");
    }
  };

  const handleAdminDashboard = () => {
    // TODO: Navigate to admin dashboard page
  };

  const handleLogout = () => {
    // TODO: Clear session and navigate to home page
  };

  const handleSearch = () => {
    // TODO: Implement search functionality to filter dishes
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Box
          component="header"
          sx={{
            height: 64,
            width: "100%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            boxShadow: 1,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <img
              src="/logoWhite.png"
              alt="Logo"
              style={{ width: 28, height: 28 }}
            />
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
            >
              Dish Detective
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={handleLogout}
            sx={{
              bgcolor: "grey.800",
              color: "white",
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            Log out
          </Button>
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              variant="outlined"
              onChange={handleSearch}
              sx={{
                flex: 1,
                bgcolor: "background.paper",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                },
              }}
            />
            <IconButton
              onClick={handleAddDish}
              sx={{
                bgcolor: "action.hover",
                color: "text.secondary",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2, borderBottomWidth: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {loading ? (
              <Typography>Loading dishes...</Typography>
            ) : dishes.length === 0 ? (
              <Typography>No dishes found. Click + to add!</Typography>
            ) : (
              dishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  name={dish.name}
                  restaurantName={dish.category}
                  position={dish.description}
                  onDelete={() => handleDeleteDish(dish._id)}
                />
              ))
            )}
          </Box>
        </Box>

        <Box
          component="footer"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        ></Box>
      </Box>
    );
  }

  const navWidth = 80;

  // TODO: Make desktop layout more responsive!

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <Box
        component="header"
        sx={{
          height: { xs: 64, sm: 88 },
          width: "100%",
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 3,
          px: 2,
          boxShadow: 1,
          position: "relative",
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
            "&:hover": {
              bgcolor: "success.dark",
            },
          }}
        >
          Admin
        </Button>
      </Box>

      <Box
        component="nav"
        sx={{
          position: "fixed",
          left: 0,
          top: { xs: 64, sm: 88 },
          bottom: 0,
          width: 80,
          bgcolor: "common.white",
          boxShadow: "2px 0 8px rgba(0,0,0,0.12)",
          zIndex: 2,
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
            <IconButton sx={{ color: "grey.900" }}>
              <HomeFilledIcon />
            </IconButton>
            <IconButton sx={{ color: "grey.900" }}>
              <TuneIcon />
            </IconButton>
            <IconButton sx={{ color: "grey.900" }}>
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
          p: { xs: 2, sm: 3, md: 5 },
          ml: `${navWidth}px`,
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 3 },
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: "#212222",
            ml: { xs: 1, sm: 2, md: 4, lg: 5 },
            lineHeight: 1.2,
            letterSpacing: -1,
          }}
        >
          Jela
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            ml: { xs: 2, sm: 4, md: 10, lg: 30 },
          }}
        >
          <TextField
            size="small"
            placeholder="Search"
            variant="outlined"
            onChange={handleSearch}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 999,
              width: "100%",
              maxWidth: 480,
              boxShadow: 0.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
              },
            }}
          />

          <IconButton
            onClick={handleAddDish}
            sx={{
              ml: 2,
              bgcolor: "action.hover",
              color: "text.secondary",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "action.selected",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ ml: 10, px: 10, mt: -2 }}>
        <Divider sx={{ borderBottomWidth: 2 }} />
      </Box>

      <Box
        sx={{
          p: 5,
          ml: `${navWidth}px`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {loading ? (
          <Typography>Loading dishes...</Typography>
        ) : dishes.length === 0 ? (
          <Typography sx={{ ml: { xs: 1, sm: 2, md: 4, lg: 5 } }}>
            No dishes found. Click + to add one!
          </Typography>
        ) : (
          dishes.map((dish) => (
            <DishCard
              key={dish._id}
              name={dish.name}
              restaurantName={dish.category}
              position={dish.description}
              onDelete={() => handleDeleteDish(dish._id)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
