import { Grid } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import { Logo, ENFlag, ESFlag } from '@/assets';
import { useLanguage } from "@/helpers";

export const Navbar = () => {
    const navigate = useNavigate(); // Hook para navegar entre páginas
    const { language, changeLanguage } = useLanguage();

    return (
        <Grid container spacing={0} alignItems="center" sx={{ width: '100%', padding: '5px 20px', backgroundColor: 'white' }}>
            {/* Columna de la flecha */}
            <Grid item xs={4} container justifyContent="start">
                <ArrowBackIos 
                    onClick={() => navigate(-1)} // Regresa a la pantalla anterior
                    sx={{ cursor: 'pointer' }} 
                />
            </Grid>

            {/* Columna del logotipo */}
            <Grid item xs={4} container justifyContent="center">
                <a href={`/menu?desk_id=${new URLSearchParams(window.location.search).get('desk_id')}`} style={{ textDecoration: 'none' }}>
                    <img src={Logo} alt='Bistro al paso' style={{ maxWidth: '100%', height: 'auto' }} />
                </a>
            </Grid>

            {/* Columna de los idiomas */}
            <Grid item xs={4} container justifyContent="end" spacing={1}>
                <Grid item>
                    <img
                        src={ENFlag}
                        alt="English"
                        style={{ width: 30, height: 30, cursor: 'pointer', opacity: language === 'en' ? 1 : 0.5 }}
                        onClick={() => changeLanguage('en')}
                    />
                </Grid>
                <Grid item>
                    <img
                        src={ESFlag}
                        alt="Español"
                        style={{ width: 30, height: 30, cursor: 'pointer', opacity: language === 'es' ? 1 : 0.5 }}
                        onClick={() => changeLanguage('es')}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
