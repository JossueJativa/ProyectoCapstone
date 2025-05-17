import { ThemeProvider, createTheme } from '@mui/material';
import { ReactNode } from 'react';

// Extensión de tipos para el tema personalizado
import '@mui/material/styles';
declare module '@mui/material/styles' {
    interface Theme {
        button: {
            cafeMedio: string;
            transparente: string;
            beige: string;
            mostaza: string;
            verde: string;
            border: {
                rounded: string;
                corners: string;
            };
        };
        background: {
            primary: string;
            secondary: string;
        };
        menu: {
            mostaza: string;
            ladrillo: string;
            azul: string;
            verde: string;
            selected: string;
            black: string;
        };
        customTypography: {
            title: {
                fontWeight: string;
                fontSize: string;
            };
            subtitle: {
                fontWeight: string;
                fontSize: string;
            };
            body1: {
                fontWeight: string;
                fontSize: string;
            };
            body2: {
                fontWeight: string;
                fontSize: string;
            };
        };
    }
    interface ThemeOptions {
        button?: Theme['button'];
        background?: Theme['background'];
        menu?: Theme['menu'];
        customTypography?: Theme['customTypography'];
    }
}

const theme = createTheme({
    button: {
        cafeMedio: '#B15C39',
        transparente: 'transparent',
        beige: '#E0DCD3',
        mostaza: '#DA9600',
        verde: '#1B5758',
        border: {
            rounded: '50px',
            corners: '15px',
        }
    },
    background: {
        primary: '#FFFFFF',
        secondary: '#D4D4D4',
    },
    menu: {
        mostaza: '#DA9600',
        ladrillo: '#C14A34',
        azul: '#184669',
        verde: '#1B5758',
        selected: '#B15C39',
        black: '#000000',
    },
    customTypography: {
        title: {
            fontWeight: 'bold',
            fontSize: '2rem',
        },
        subtitle: {
            fontWeight: 'normal',
            fontSize: '1.5rem',
        },
        body1: {
            fontWeight: 'lighter',
            fontSize: '1rem',
        },
        body2: {
            fontWeight: 'lighter',
            fontSize: '0.8rem',
        },
    },
    shape: {
        borderRadius: 10,
    }
});

interface GlobalThemeProps {
    children: ReactNode;
}

const GlobalTheme = ({ children }: GlobalThemeProps) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export { GlobalTheme };