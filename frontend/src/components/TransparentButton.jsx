import { Button, Box } from '@mui/material';

export const TransparentButton = ({ text, onClick }) => {
    return (
        <Box mb={2}>
            <Button
                variant="outlined"
                fullWidth
                onClick={onClick}
                sx={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                    color: '#6C6C6C',
                    border: '1px solid #6C6C6C',
                    textTransform: 'none',
                    fontSize: '14px',
                }}
            >
                {text}
            </Button>
        </Box>
    );
};