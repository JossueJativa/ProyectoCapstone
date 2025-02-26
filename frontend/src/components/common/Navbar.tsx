import { Grid } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';

import { Logo, ENFlag, ESFlag } from '@/assets';
import { useLanguage } from "@/helpers";

export const Navbar = () => {
    const { language, changeLanguage, texts } = useLanguage();

    return (
        <Grid container spacing={0} alignItems="center" sx={{ width: '100%', padding: '5px 20px', backgroundColor: 'white' }}>
            {/* Columna de la flecha */}
            <Grid item xs={4} container justifyContent="start">
                <ArrowBackIos />
            </Grid>

            {/* Columna del logotipo */}
            <Grid item xs={4} container justifyContent="center">
                <img src={Logo} alt='Bistro al paso' style={{ maxWidth: '100%', height: 'auto' }} />
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
