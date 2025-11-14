"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getAllRestaurants } from "../../restaurants/actions";
import { createEmployeeAccount } from "./actions";
import SuccessScreen from "@/components/SuccessScreen";
import AdminNavbar, { navWidth, headerHeight } from "@/components/AdminNavbar";

type Restaurant = {
  _id: string;
  name: string;
};

export default function EmployeeCreatePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // ...existing code...
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    password: "",
    restaurantId: "",
    role: "worker" as "worker" | "manager",
  });
  // Password validation function
  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Lozinka mora imati minimalno 8 znakova";
    }
    return "";
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    if (password) {
      setPasswordError(validatePassword(password));
    } else {
      setPasswordError("");
    }
  };

  // Load restaurants on mount
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const result = await getAllRestaurants();
        if (result.success && result.data) {
          setRestaurants(result.data);
        } else {
          setError("Failed to load restaurants");
        }
      } catch (err) {
        setError("Failed to load restaurants");
      } finally {
        setLoadingRestaurants(false);
      }
    }
    loadRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await createEmployeeAccount({
        name: formData.name,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        restaurantId: formData.restaurantId,
      });

      if (result.success) {
        setSuccess("Račun uspješno kreiran!");
        setShowSuccessScreen(true);
        // Redirect after showing success screen
        setTimeout(() => {
          router.push("/admin/accounts");
        }, 2000);
      } else {
        setError(result.error || "Neuspješno kreiranje računa");
      }
    } catch (err) {
      setError("Došlo je do greške prilikom kreiranja računa");
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after successful creation
  if (showSuccessScreen) {
    return <SuccessScreen message="Račun uspješno kreiran!" />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <>
        <AdminNavbar isMobile={isMobile} />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            pb: "134px", // Space for button (70px) + navbar (64px)
          }}
        >
          <Box sx={{ p: 3, flexGrow: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 780,
                mb: 4,
                color: "#212222",
              }}
            >
              Unesite podatke
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Ime"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Prezime"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Korisničko ime"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Lozinka"
                type="password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                error={!!passwordError && formData.password.length > 0}
                helperText={
                  passwordError && formData.password.length > 0
                    ? passwordError
                    : "Minimalno 8 znakova"
                }
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                select
                label="Ime restorana"
                value={formData.restaurantId}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantId: e.target.value })
                }
                required
                disabled={loadingRestaurants}
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {loadingRestaurants ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Učitavanje...
                  </MenuItem>
                ) : restaurants.length === 0 ? (
                  <MenuItem disabled>Nema dostupnih restorana</MenuItem>
                ) : (
                  restaurants.map((restaurant) => (
                    <MenuItem key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                fullWidth
                select
                label="Odaberite poziciju"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "worker" | "manager",
                  })
                }
                required
                sx={{
                  mb: 3,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="worker">Radnik</MenuItem>
                <MenuItem value="manager">Voditelj</MenuItem>
              </TextField>
            </Box>
          </Box>

          {/* Fixed Button Area at Bottom */}
          <Box
            onClick={
              loading || loadingRestaurants || !!passwordError
                ? undefined
                : handleSubmit
            }
            sx={{
              position: "fixed",
              bottom: "64px",
              left: 0,
              right: 0,
              height: "70px",
              bgcolor:
                loading || loadingRestaurants || !!passwordError
                  ? "grey.400"
                  : "#57aaf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor:
                loading || loadingRestaurants || !!passwordError
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s ease-in-out",
              zIndex: 1000,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
              "&:active": {
                bgcolor:
                  loading || loadingRestaurants || !!passwordError
                    ? "grey.400"
                    : "#3d8fd9",
              },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={24} color="inherit" />
                  Kreiranje...
                </Box>
              ) : (
                "Kreiraj račun"
              )}
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <AdminNavbar isMobile={isMobile} />
      <Box
        sx={{
          height: `calc(100vh - ${headerHeight}px)`,
          bgcolor: "#f5f5f5",
          pt: `${headerHeight}px`,
          pb: 3,
          pl: `${navWidth}px`,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: 500,
            width: "100%",
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            boxShadow: 2,
            mx: "auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 780,
              mb: 4,
              textAlign: "center",
              color: "#212222",
            }}
          >
            Unesite podatke
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Ime"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Prezime"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Korisničko ime"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              error={!!passwordError && formData.password.length > 0}
              helperText={
                passwordError && formData.password.length > 0
                  ? passwordError
                  : "Minimalno 8 znakova"
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              select
              label="Ime restorana"
              value={formData.restaurantId}
              onChange={(e) =>
                setFormData({ ...formData, restaurantId: e.target.value })
              }
              required
              disabled={loadingRestaurants}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              {loadingRestaurants ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Učitavanje...
                </MenuItem>
              ) : restaurants.length === 0 ? (
                <MenuItem disabled>Nema dostupnih restorana</MenuItem>
              ) : (
                restaurants.map((restaurant) => (
                  <MenuItem key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              fullWidth
              select
              label="Odaberite poziciju"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "worker" | "manager",
                })
              }
              required
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="worker">Radnik</MenuItem>
              <MenuItem value="manager">Voditelj</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || loadingRestaurants || !!passwordError}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: "#57aaf4",
                "&:hover": {
                  bgcolor: "#3d8fd9",
                  boxShadow: 4,
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Kreiranje...
                </>
              ) : (
                "Kreiraj račun"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
