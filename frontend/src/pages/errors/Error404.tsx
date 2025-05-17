import { Box, Typography } from '@mui/material';
import { useLanguage } from '@/helpers'; // Importa el hook de idioma

export const Error404 = () => {
    const { texts } = useLanguage(); // Obtén los textos traducidos

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
        >
            <Typography variant="h1" component="div" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                {texts.errors.notFoundTitle} {/* Título traducido */}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {texts.errors.notFoundMessage} {/* Mensaje traducido */}
            </Typography>
        </Box>
    );
};
