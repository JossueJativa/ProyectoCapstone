import { Grid } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';

import { Logo, ENFlag, ESFlag } from '@/assets';

export const Navbar = () => {
    return (
        <Grid container spacing={0} alignItems="center" sx={{ width: '100%', padding: '5px 20px', backgroundColor: 'white' }}>
            {/* Columna de la flecha */}
            <Grid item xs={4} container justifyContent="start">
                <ArrowBackIos />
            </Grid>

            {/* Columna del logotipo */}
            <Grid item xs={4} container justifyContent="center">
                <img src={Logo} alt="Bistro Al Paso" style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>

            {/* Columna de los idiomas */}
            <Grid item xs={4} container justifyContent="end" spacing={1}>
                <Grid item>
                    <img src={ENFlag} alt="English" style={{ width: 30, height: 30 }} />
                </Grid>
                <Grid item>
                    <img src={ESFlag} alt="Español" style={{ width: 30, height: 30 }} />
                </Grid>
            </Grid>
        </Grid>
    );
};
