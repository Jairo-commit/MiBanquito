import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as styles from "./notFound.sx";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <Box sx={styles.pageContainerSx}>
            <Box sx={styles.glassCardSx}>
                <Typography variant="h1" sx={styles.headingNumberSx}>
                    404
                </Typography>
                <Typography variant="h5" color="text.primary">
                    Page not found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={styles.goHomeButtonSx}
                >
                    Go home
                </Button>
            </Box>
        </Box>
    );
}
