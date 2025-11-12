"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function Page() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        my: 3,
                    }}
                >
                    Student login
                </Typography>
            {/*<Box sx={{*/}
            {/*    color: "#edeff1",*/}
            {/*}}>*/}
                <SignIn
                    appearance={{
                        elements: {
                            dividerRow: {
                                display: "none",
                            },
                            footer: {
                                display: "none",
                            },
                            formFieldInput: {
                                display: "none"
                            },
                            formFieldLabelRow: {
                                display: "none"
                            },
                            formButtonPrimary: {
                                display: "none",
                            },
                            identifierField: {
                                display: "none",
                            },
                            formFieldAction: {
                                display: "none",
                            },
                            headerTitle: {
                                display:"none"
                            },
                            headerSubtitle: {
                                display:"none"
                            },
                            socialButtonsBlockButton: {
                                height: "300%",
                            },
                            socialButtonsBlockButtonText: {
                                fontSize: "1.3rem",
                            },
                            cardBox: {
                                boxShadow: "none",
                            }

                        }
                    }}
                    routing="path"
                    path="/login/student"
                    signUpUrl="/login/student"
                    forceRedirectUrl="/student/dashboard"
                />
            {/*</Box>*/}


            </Box>

        </Box>

    );
}


