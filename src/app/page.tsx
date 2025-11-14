"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PancakeStackLoader from "@/components/PancakeStackLoader";
import { getUserRole } from "./actions";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [checkingRole, setCheckingRole] = useState(true);

  // Used for main login dropdown
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // Used for top-right (mini) login dropdown
  const [anchorElTop, setAnchorElTop] = React.useState<null | HTMLElement>(
    null,
  );
  const openTop = Boolean(anchorElTop);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isShortScreen = useMediaQuery("(max-height: 740px)");

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    async function checkUserRole() {
      if (!isLoaded) return;

      if (isSignedIn && user) {
        // Fetch user role using server action
        const { role, error } = await getUserRole();

        if (role) {
          switch (role) {
            case "admin":
              router.push("/admin");
              return;
            case "manager":
              router.push("/manager");
              return;
            case "worker":
              router.push("/worker");
              return;
            case "student":
              router.push("/student");
              return;
          }
        }

        if (error) {
          console.error("Error fetching user role:", error);
        }
      }

      setCheckingRole(false);
    }

    checkUserRole();
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading while checking authentication
  if (!isLoaded || checkingRole) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <Box sx={{ width: 200, height: 200 }}>
          <PancakeStackLoader />
        </Box>
      </Box>
    );
  }

  const handleRoleSelect = (role: string) => {
    setAnchorEl(null);
    setAnchorElTop(null);

    // Navigate to appropriate login page based on role
    if (role === "student") {
      router.push("/login/student");
    } else if (role === "radnik") {
      router.push("/login/employee");
    }
  };

  const handleKontakt = () => {
    // TODO: go to contact page
  };

  // Mobile layout
  if (isMobile) {
    return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(/mobilebg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 4,
            padding: 4,
            maxWidth: "90%",
            boxShadow: 3,
            mt: 2,
            mb: 2,
            "@media (max-height: 740px)": {
              mt: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              component="img"
              src="logoDark.png"
              alt="Dish Detective Logo"
              sx={{
                width: "18vh",
                height: "18vh",
                mb: 1,
                "@media (min-height: 900px)": {
                  width: "20vh",
                  height: "20vh",
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "#000000d4",
                fontWeight: 750,
                textAlign: "center",
              }}
            >
              Dish Detective
            </Typography>
          </Box>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: "#000000d4",
              mb: 2,
              textAlign: "center",
              letterSpacing: -1,
              fontSize: { xs: "6vh" },
            }}
          >
            Poboljšaj svoje iskustvo u menzi
          </Typography>

          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              mb: 3,
              color: "#3c403d",
              textAlign: "center",
              fontSize: { xs: "1.1rem" },
            }}
          >
            Real-time jelovnik u restoranima
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            fullWidth
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              minHeight: 50,
              textTransform: "none",
            }}
          >
            Prijava
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            // We make the menu open upwards on short screens
            // TODO: Think of a better responsive fix, I guess?
            anchorOrigin={{
              vertical: isShortScreen ? "top" : "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: isShortScreen ? "bottom" : "top",
              horizontal: "center",
            }}
            slotProps={{
              list: {
                disablePadding: true,
              },
              paper: {
                sx: { minWidth: 300, mt: 1, borderRadius: 2 },
              },
            }}
          >
            <MenuItem
              onClick={() => handleRoleSelect("radnik")}
              sx={{ fontSize: "1.2rem", py: 1.2 }}
            >
              Radnik u menzi
            </MenuItem>
            <Box sx={{ borderBottom: "1px solid black", my: 0 }} />
            <MenuItem
              onClick={() => handleRoleSelect("student")}
              sx={{ fontSize: "1.2rem", py: 1.2 }}
            >
              Student
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 10,
        backgroundImage: `url(/desktopbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.95,
      }}
    >
      {/* This overlay box makes the background a bit darker */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.13)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          maxWidth: 600,
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{
            color: "white",
            mb: 2,
            lineHeight: 1.2,
            wordBreak: "break-word",
            letterSpacing: -1,
          }}
        >
          Poboljšaj svoje iskustvo u menzi
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: "lightgrey",
            letterSpacing: 1.2,
          }}
        >
          Real-time jelovnik u restoranima
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              width: "25%",
              minHeight: 45,
              color: "white",
              textTransform: "none",
            }}
          >
            Prijava
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              list: {
                disablePadding: true,
              },
              paper: {
                sx: { minWidth: 300, mt: 1, borderRadius: 2 },
              },
            }}
          >
            <MenuItem
              onClick={() => handleRoleSelect("radnik")}
              sx={{ fontSize: "1rem", py: 1.2 }}
            >
              Radnik u menzi
            </MenuItem>
            <Box sx={{ borderBottom: "1px solid black", my: 0 }} />
            <MenuItem
              onClick={() => handleRoleSelect("student")}
              sx={{ fontSize: "1rem", py: 1.2 }}
            >
              Student
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
}
