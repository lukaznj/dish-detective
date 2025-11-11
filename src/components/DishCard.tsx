"use client";

import { Paper, Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactNode } from "react";

interface UserListItemProps {
  name: string;
  restaurantName: string;
  position: string;
  onDelete: () => void;
}

const UserListItem = ({
  name,
  restaurantName,
  position,
  onDelete,
}: UserListItemProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mb: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {restaurantName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {position}
        </Typography>
      </Box>

      <IconButton
        aria-label="delete"
        size="large"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        sx={{
          bgcolor: "action.hover",
          width: 48,
          height: 48,
          "&:hover": {
            bgcolor: "error.light",
            color: "white",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
};

export default UserListItem;
