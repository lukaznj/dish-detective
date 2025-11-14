"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Menu,
  MenuItem,
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomepage = pathname === "/";
  const isLoginRoute = pathname.startsWith("/login");


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  if (isHomepage) {
    return (
      <AppBar
        position="absolute"
        elevation={0}
        sx={{ background: "transparent", zIndex: 50 }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 2,
            px: { xs: 3, lg: 4 },
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "white",
            }}
          >
            <Image
              src="/logoWhite.png"
              alt="Dish Detective Logo"
              width={32}
              height={32}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                "&:hover": {
                  color: "grey.200",
                },
              }}
            >
              Dish Detective
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "black",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            >
              Kontakt
            </Button>

            <Button
              aria-controls={open ? "prijava-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              variant="contained"
              sx={{
                bgcolor: "#ff8c00",
                color: "white",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#f18501ff",
                },
              }}
            >
              Prijava
            </Button>

            <Menu
              id="prijava-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              slotProps={{
                paper: {
                  sx: { minWidth: 200, mt: 1, borderRadius: 2 },
                },
                list: {
                  "aria-labelledby": "prijava-button",
                },
              }}
            >
              <MenuItem onClick={() => router.push("/login/employee")}>
                Radnik u menzi
              </MenuItem>
              <Box sx={{ borderBottom: "1px solid #e0e0e0", my: 0 }} />
              <MenuItem onClick={() => router.push("/login/student")}>
                Student
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }


    return (
      <AppBar position="static" sx={{ bgcolor: "#56aaf4" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 2,
            px: { xs: 3, lg: 4 },
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "white",
            }}
          >
            <Image
              src="/logoWhite.png"
              alt="Dish Detective Logo"
              width={32}
              height={32}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                "&:hover": {
                  color: "grey.200",
                },
              }}
            >
              Dish Detective
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
            {!isLoginRoute && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );

}
