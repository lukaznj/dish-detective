"use client";

import { Paper, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface EmployeeCardProps {
  id: string;
  firstName: string;
  lastName: string;
  restaurantName: string;
  role: "manager" | "worker";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function EmployeeCard({
  id,
  firstName,
  lastName,
  restaurantName,
  role,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const displayRole = role === "manager" ? "Voditelj" : "Radnik";

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
          borderColor: "#bdbdbd",
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: "#333",
          }}
        >
          {firstName} {lastName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 0.3,
          }}
        >
          {restaurantName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#999",
          }}
        >
          {displayRole}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {onEdit && (
          <IconButton
            onClick={() => onEdit(id)}
            sx={{
              color: "#666",
              "&:hover": {
                color: "#1976d2",
                bgcolor: "#e3f2fd",
              },
            }}
            aria-label="edit employee"
          >
            <EditIcon />
          </IconButton>
        )}

        {onDelete && (
          <IconButton
            onClick={() => onDelete(id)}
            sx={{
              color: "#666",
              "&:hover": {
                color: "#d32f2f",
                bgcolor: "#ffebee",
              },
            }}
            aria-label="delete employee"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}

