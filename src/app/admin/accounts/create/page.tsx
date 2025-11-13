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
} from "@mui/material";
import { getAllRestaurants } from "../../restaurants/actions";
import { createWorkerManagerAccount } from "./actions";

type Restaurant = {
  _id: string;
  name: string;
};

export default function ManagerWorkerCreatePage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");

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
      const result = await createWorkerManagerAccount({
        name: formData.name,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        restaurantId: formData.restaurantId,
      });

      if (result.success) {
        setSuccess("Račun uspješno kreiran!");
        // Reset form
        setFormData({
          name: "",
          lastName: "",
          username: "",
          password: "",
          restaurantId: "",
          role: "worker",
        });
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/accounts");
        }, 1500);
      } else {
        setError(result.error || "Neuspješno kreiranje računa");
      }
    } catch (err) {
      setError("Došlo je do greške prilikom kreiranja računa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Prezime"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Korisničko ime"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Lozinka..."
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 3 }}
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
  );
}
