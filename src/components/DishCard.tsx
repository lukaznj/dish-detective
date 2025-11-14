"use client";

import { Paper, Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface DishCardProps {
  name: string;
  restaurantName: string;
  position: string;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete: () => void;
}

const DishCard = ({
  name,
  restaurantName,
  position,
  imageUrl,
  onEdit,
  onDelete,
}: DishCardProps) => {
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
