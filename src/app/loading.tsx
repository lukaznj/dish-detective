import PancakeStackLoader from "@/components/PancakeStackLoader";
import { Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box sx={{ width: 200, height: 200 }}>
        <PancakeStackLoader />
      </Box>
    </Box>
  );
}
