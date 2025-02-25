import { ThemeProvider, createTheme, Theme } from '@mui/material';

const GlobalTheme = ({ children }: { children: React.ReactNode }) => {
    const theme: Theme = createTheme({
        palette: {
            primary: {
                main: '#b15c39',
            },
            secondary: {
                main: '#1b5758',
            },
            background: {
                default: '#e0dcd3'
            },
            button: {
                primary: '#da9600',
                secondary: '#c14a34',
                ternary: '#184669',
                fourth: '#1b5758',
            },
            error: {
                main: '#f44336',
            },
            warning: {
                main: '#ff9800',
            },
            info: {
                main: '#2196f3',
            },
            success: {
                main: '#4caf50',
            },
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
            borderRadius: 10,
        }
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export { GlobalTheme };