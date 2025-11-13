"use client";

import React, { useState } from "react";

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
  id: string;
  name: string;
  restaurantName: string;
  position: string;
}

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isShortScreen = useMediaQuery("(max-height: 740px)");

  const [dishes, setDishes] = useState<Dish[]>([]);

  const handleAddDish = () => {
    const newDish: Dish = {
      id: Date.now().toString(),
      name: `Dish ${dishes.length + 1}`,
      restaurantName: "Sample Restaurant",
      position: "Main Course",
    };
    setDishes([...dishes, newDish]);
  };

  const handleDeleteDish = (id: string) => {
    setDishes(dishes.filter((dish) => dish.id !== id));
  };

  if (isMobile) {
    return null;
  }

  const navWidth = 100;

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
          width: 100,
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
            <Button variant="text" sx={{ minWidth: 90 }}>
              Icon1
            </Button>
            <Button variant="text" sx={{ minWidth: 90 }}>
              Icon2
            </Button>
            <Button variant="text" sx={{ minWidth: 90 }}>
              Icon3
            </Button>
            <Button variant="text" sx={{ minWidth: 90 }}>
              Icon4
            </Button>
            <Button variant="text" sx={{ minWidth: 90 }}>
              Icon5
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          p: 5,
          ml: `${navWidth}px`,
          display: "flex",
          alignItems: "center",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: "#212222",
            ml: 10,
            lineHeight: 1.2,
            wordBreak: "break-word",
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
            ml: 30,
          }}
        >
          <TextField
            size="small"
            placeholder="Search"
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              borderRadius: 999,
              width: { xs: 160, sm: 480 },
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
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            name={dish.name}
            restaurantName={dish.restaurantName}
            position={dish.position}
            onDelete={() => handleDeleteDish(dish.id)}
          />
        ))}
      </Box>
    </Box>
  );
}
