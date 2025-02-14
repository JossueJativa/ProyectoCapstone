import { Button, Box } from '@mui/material';

export const OrangeButton = ({ text, onClick }) => {
    return (
        <Box mb={2}>
            <Button
                variant="contained"
                fullWidth
                onClick={onClick}
                sx={{
                    backgroundColor: "#FF8C00",
                    color: "#FFFFFF",
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    "&:hover": {
                        backgroundColor: "#FFA500",
                    },
                }}
            >
                {text}
            </Button>
        </Box>
    )
}
