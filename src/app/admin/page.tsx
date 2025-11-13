"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import TuneIcon from "@mui/icons-material/Tune";
import CreateIcon from "@mui/icons-material/Create";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";

import { ReactNode } from "react";
import { People } from "@mui/icons-material";

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const ActionButton = ({ children, onClick }: ActionButtonProps) => (
  <Button
    variant="outlined"
    fullWidth
    onClick={onClick}
    sx={{
      textTransform: "none",
      fontSize: "1.25rem",
      fontWeight: "600",
      padding: "20px 15px",
      borderRadius: "8px",
      borderColor: "rgba(0, 0, 0, 0.23)",
      color: "text.primary",
      "&:hover": {
        borderColor: "primary.main",
      },
      mb: 3,
    }}
  >
    {children}
  </Button>
);

export default function Page() {
  const handleActionClick = (action: string) => {
    console.log(`Kliknuta akcija: ${action}`);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "flex-start",
          pt: 4,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flexGrow: 0,
            maxWidth: 600,
            mx: "auto",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 4,
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.25rem" },
            }}
          >
            Izaberite akciju
          </Typography>

          <Box>
            <ActionButton onClick={() => handleActionClick("restorani")}>
              Upravljaj restoranima
            </ActionButton>
            <ActionButton onClick={() => handleActionClick("jelima")}>
              Upravljaj jelima
            </ActionButton>
            <ActionButton onClick={() => handleActionClick("racunima")}>
              Upravljaj računima
            </ActionButton>
          </Box>
        </Box>
      </Box>
    );
  }

  const navWidth = 80;

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
          zIndex: 1,
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
            <IconButton sx={{ color: "grey.900" }}>
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
          //marginLeft: `${navWidth}px`,
          flexGrow: 1,
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            height: 80,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            zIndex: 20,
            position: "relative"
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
            // onClick={handleAdminDashboard}
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
        <Typography
          marginLeft = {`${navWidth}px`}
          variant="h4"
          fontWeight={780}
          sx={{ color: "#212222", p: 5 }}
        >
          Dobrodošli
        </Typography>

        <Box sx={{ px: 4, mt: -3, marginLeft: `${navWidth}px`}}>
          <Divider sx={{ borderBottomWidth: 2 }} />
        </Box>

        <Box
          sx={{
            px: 5,
            py: 4,
            display: "flex",
            marginLeft: `${navWidth}px`,
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleActionClick("restorani")}
            sx={{
              flex: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 150,
              maxWidth: 350,
              bgColor: "white",
              boxShadow: 2,
              p: 3,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "text.primary",
              "&:hover": {
                bgcolor: "grey.10",
                boxShadow: 4,
              },
            }}
          >
            <TuneIcon sx={{ fontSize: 40, color: "text.primary" }} />
            <Typography
              sx={{
                fontSize: "1.6vw",
                fontWeight: "600",
                color: "text.primary",
                pt: 1,
              }}
            >
              Upravljaj restoranima
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9vw",
                fontWeight: "550",
                color: "text.secondary",
                pt: 1,
              }}
            >
              • Dodavanje i brisanje restorana
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9vw",
                fontWeight: "550",
                color: "text.secondary",
              }}
            >
              • Postavljanje voditelja menze
            </Typography>
          </Button>
          <Button
            onClick={() => handleActionClick("restorani")}
            sx={{
              flex: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 150,
              maxWidth: 350,
              minHeight: 350,
              bgColor: "white",
              boxShadow: 2,
              p: 3,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "text.primary",
              "&:hover": {
                bgcolor: "grey.10",
                boxShadow: 4,
              },
            }}
          >
            <CreateIcon sx={{ fontSize: 40, color: "text.primary" }} />
            <Typography
              sx={{
                fontSize: "1.6vw",
                fontWeight: "600",
                color: "text.primary",
                pt: 1,
              }}
            >
              Upravljaj jelima
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9vw",
                fontWeight: "550",
                color: "text.secondary",
                pt: 1,
              }}
            >
              • Dodavanje i brisanje jela
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9vw",
                fontWeight: "550",
                color: "text.secondary",
              }}
            >
              • Naglašavanje sastojaka i alergena
            </Typography>
          </Button>
          <Button
            onClick={() => handleActionClick("restorani")}
            sx={{
              flex: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 150,
              maxWidth: 350,
              bgColor: "white",
              boxShadow: 2,
              p: 3,
              pb: 5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "text.primary",
              "&:hover": {
                bgcolor: "grey.10",
                boxShadow: 4,
              },
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, color: "text.primary" }} />
            <Typography
              sx={{
                fontSize: "1.6vw",
                fontWeight: "600",
                color: "text.primary",
                pt: 1,
              }}
            >
              Upravljaj računima
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9vw",
                fontWeight: "550",
                color: "text.secondary",
                pt: 1,
              }}
            >
              • Dodavanje i brisanje računa radnika
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: "primary.main",
            height: 50,
            width: "100%",
            mt: "auto",
            zIndex: 20,
            position: "relative"
          }}
        />
      </Box>
    </Box>
  );
}
