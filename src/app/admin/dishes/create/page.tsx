"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { createDishWithImage } from "./actions";
import SuccessScreen from "@/components/SuccessScreen";

export default function Page() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    allergens: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [allergenInput, setAllergenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageError(null); // Clear error when image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddAllergen = () => {
    const trimmed = allergenInput.trim();
    if (trimmed && !formData.allergens.includes(trimmed)) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, trimmed],
      });
      setAllergenInput("");
    }
  };

  const handleRemoveAllergen = (allergenToRemove: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((a) => a !== allergenToRemove),
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validate image is uploaded
    if (!imageFile) {
      setImageError("Slika je obavezna");
      setError("Molimo odaberite sliku jela");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setImageError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("allergens", formData.allergens.join(","));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await createDishWithImage(formDataToSend);

      if (response.success) {
        setSuccess("Jelo uspješno kreirano!");
        setShowSuccessScreen(true);
        setTimeout(() => {
          router.push("/admin/dishes");
        }, 2000);
      } else {
        setError(response.message || "Greška pri kreiranju jela");
      }
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after successful creation
  if (showSuccessScreen) {
    return <SuccessScreen message="Jelo uspješno kreirano!" />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <Box
        sx={{
          height: "100vh",
          bgcolor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{
          p: 3,
          flexGrow: 1,
          overflowY: "auto",
          pb: "200px", // Space for button (70px) + navbar (64px) + extra margin (20px)
        }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 780,
              mb: 4,
              color: "#212222",
            }}
          >
            Dodaj novo jelo
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
            {/* ...existing code... */}
            {/* Image Upload */}
            <Box
              sx={{
                mb: 3,
                bgcolor: "white",
                borderRadius: 2,
                p: 2,
                border: "2px dashed",
                borderColor: imageError
                  ? "error.main"
                  : imagePreview
                    ? "primary.main"
                    : "grey.300",
                textAlign: "center",
                position: "relative",
              }}
            >
              {imagePreview ? (
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "error.dark",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload-mobile"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload-mobile">
                    <Button
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Odaberi sliku *
                    </Button>
                  </label>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: imageError ? "error.main" : "text.secondary" }}
                  >
                    {imageError || "PNG, JPG do 5MB"}
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Naziv jela"
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
              label="Opis"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              multiline
              rows={3}
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
              label="Kategorija"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
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

            {/* Allergens Input */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Dodaj alergen"
                  value={allergenInput}
                  onChange={(e) => setAllergenInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAllergen();
                    }
                  }}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddAllergen}
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {formData.allergens.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.allergens.map((allergen) => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      onDelete={() => handleRemoveAllergen(allergen)}
                      sx={{
                        bgcolor: "white",
                        border: "1px solid",
                        borderColor: "primary.main",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Fixed Button Area at Bottom */}
        <Box
          onClick={loading ? undefined : handleSubmit}
          sx={{
            position: "fixed",
            bottom: "64px",
            left: 0,
            right: 0,
            height: "70px",
            bgcolor: loading ? "grey.400" : "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease-in-out",
            "&:active": {
              bgcolor: loading ? "grey.400" : "primary.dark",
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
              "Dodaj jelo"
            )}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Desktop Layout
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 2,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4, pb: 2, flexShrink: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 780,
              mb: 4,
              textAlign: "center",
              color: "#212222",
            }}
          >
            Dodaj novo jelo
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
        </Box>

        <Box
          sx={{
            px: 4,
            pb: 4,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {/* ...existing code... */}
          {/* Image Upload */}
          <Box
            sx={{
              mb: 3,
              borderRadius: 2,
              p: 2,
              border: "2px dashed",
              borderColor: imageError
                ? "error.main"
                : imagePreview
                  ? "primary.main"
                  : "grey.300",
              textAlign: "center",
              position: "relative",
            }}
          >
            {imagePreview ? (
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "error.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "error.dark",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload-desktop"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload-desktop">
                  <Button
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Odaberi sliku *
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: imageError ? "error.main" : "text.secondary" }}
                >
                  {imageError || "PNG, JPG do 5MB"}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Naziv jela"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Opis"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            multiline
            rows={3}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            label="Kategorija"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Allergens Input */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Dodaj alergen"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAllergen();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                onClick={handleAddAllergen}
                sx={{
                  bgcolor: "grey.100",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {formData.allergens.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.allergens.map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    onDelete={() => handleRemoveAllergen(allergen)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
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
              "Dodaj jelo"
            )}
          </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
