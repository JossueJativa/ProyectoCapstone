import { ThemeProvider, createTheme, Theme } from '@mui/material';
import { ReactNode } from 'react';

const theme: Theme = createTheme({
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
    typography: {
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
        borderRadius: '10px',
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