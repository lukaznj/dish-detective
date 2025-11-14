"use client";

import { ReactNode } from "react";
import AdminNavbar, { navWidth, headerHeight } from "@/components/AdminNavbar";
import { Box, useMediaQuery, useTheme } from "@mui/material";

export default function AdminLayoutClient({
    children,
}: {
    children: ReactNode;
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={{
            display: "flex",

        }}>
            <AdminNavbar isMobile={isMobile} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pl: isMobile ? 0 : `${navWidth}px`,
                    width: isMobile ? "100%" : `calc(100% - ${navWidth}px)`,
                    pb: isMobile ? "64px" : 0,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

