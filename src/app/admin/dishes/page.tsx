"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

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
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
  const router = useRouter();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    router.push("/admin");
  };

  const handleLogout = () => {
    // TODO: Clear session and navigate to home page
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDishes = dishes.filter((dish) => {
    const query = searchQuery.toLowerCase();
    return (
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query) ||
      dish.allergens.some((allergen) => allergen.toLowerCase().includes(query))
    );
  });

  if (isMobile) {
    return (
      <Box
        sx={{
          height: "100vh",
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
            top: 0,
            flexShrink: 0,
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

        <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              variant="outlined"
              value={searchQuery}
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
            ) : filteredDishes.length === 0 ? (
              <Typography>
                {searchQuery
                  ? "No dishes found matching your search."
                  : "No dishes found. Click + to add!"}
              </Typography>
            ) : (
              filteredDishes.map((dish) => (
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
            height: 60,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            px: 2,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <IconButton sx={{ color: "grey.900" }}>
            <PersonIcon />
          </IconButton>
          <IconButton sx={{ color: "grey.900" }}>
            <HomeFilledIcon />
          </IconButton>
          <IconButton sx={{ color: "grey.900" }}>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  // ...existing code...
  const navWidth = 80;

  // TODO: Make desktop layout more responsive!

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
            <IconButton sx={{ color: "grey.900" }}>
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
          flexDirection: "column",
          flex: 1,
          //ml: `${navWidth}px`,
          height: "100vh",
        }}
      >
        {/* Sticky Header */}
        <Box
          component="header"
          sx={{
            height: { xs: 64, sm: 80 },
            width: "100%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 50,
            px: 4,
            boxShadow: 1,
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
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Admin
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3, md: 5 },
          }}
        >
          {/* Search and Title Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 2,
              ml: `${navWidth}px`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={780}
              sx={{
                width: "fit-content",
                color: "#212222",
                ml: { xs: 1, sm: 2, md: 4, lg: 6 },
                lineHeight: 1.2,
                letterSpacing: -1,
                display: { sm: "none", md: "block" },
              }}
            >
              Jela
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                px: { xs: 2, sm: 3, md: 5 },
              }}
            >
              <TextField
                size="small"
                placeholder="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 999,
                  width: "100%",
                  mt: { sm: 0, md: -6 },
                  maxWidth: { sm: 400, md: 330, lg: 480 },
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
                  mt: { sm: 0, md: -6 },
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

          <Box sx={{ px: { xs: 1, sm: 2, md: 4, lg: 5 }, ml: `${navWidth}px` }}>
            <Divider sx={{ borderBottomWidth: 2 }} />
          </Box>

          <Box
            sx={{
              pt: 5,
              px: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              ml: `${navWidth}px`,
            }}
          >
            {loading ? (
              <Typography>Loading dishes...</Typography>
            ) : filteredDishes.length === 0 ? (
              <Typography sx={{ ml: { sm: 1, md: 1, lg: 1 } }}>
                {searchQuery
                  ? "No dishes found matching your search."
                  : "No dishes found. Click + to add one!"}
              </Typography>
            ) : (
              filteredDishes.map((dish) => (
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
            height: 50,
            width: "100%",
            bgcolor: "primary.main",
            flexShrink: 0, // Prevent footer from shrinking
            zIndex: 50,
          }}
        />
      </Box>
    </Box>
  );
}
