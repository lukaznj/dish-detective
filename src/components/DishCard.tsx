"use client";

import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface DishCardProps {
  name: string;
  restaurantName: string;
  position: string;
  imageUrl?: string;
  allergens?: string[];
  onEdit?: () => void;
  onDelete: () => void;
}

const DishCard = ({
  name,
  restaurantName,
  position,
  imageUrl,
  allergens = [],
  onEdit,
  onDelete,
}: DishCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Mobile Layout - Horizontal card with image on left
  if (isMobile) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          height: 120,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        {/* Image Section - Left side */}
        <Box
          sx={{
            width: 120,
            height: "100%",
            bgcolor: "grey.200",
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!imageUrl && (
            <Typography variant="caption" color="text.secondary">
              No Image
            </Typography>
          )}
        </Box>

        {/* Content Section - Right side */}
        <Box
          sx={{
            p: 1.5,
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                mb: 0.5,
              }}
            >
              {restaurantName}
            </Typography>
            {allergens.length > 0 && (
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
              >
                {allergens.slice(0, 2).map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      bgcolor: "error.light",
                      color: "white",
                    }}
                  />
                ))}
                {allergens.length > 2 && (
                  <Chip
                    label={`+${allergens.length - 2}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      bgcolor: "grey.400",
                      color: "white",
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            {onEdit && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 32,
                  height: 32,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size="small"
              sx={{
                bgcolor: "error.main",
                color: "white",
                width: 32,
                height: 32,
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Desktop Layout - Vertical card with image on top
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          bgcolor: "grey.200",
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!imageUrl && (
          <Typography variant="body2" color="text.secondary">
            No Image
          </Typography>
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {restaurantName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {position}
        </Typography>

        {/* Allergens */}
        {allergens.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {allergens.map((allergen) => (
              <Chip
                key={allergen}
                label={allergen}
                size="small"
                sx={{
                  bgcolor: "error.light",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: "auto",
          }}
        >
          {onEdit && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                flex: 1,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              flex: 1,
              bgcolor: "error.main",
              color: "white",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default DishCard;
