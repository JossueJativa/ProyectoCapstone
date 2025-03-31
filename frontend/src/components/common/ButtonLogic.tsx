import { Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { IButtonLogicProps } from '@/interfaces';

export const ButtonLogic: FC<IButtonLogicProps> = ({ text, typeButton, urlLink, onClick, icon }) => {
    const theme = useTheme();

    // Validación: No pueden estar ambos definidos a la vez
    if (onClick && urlLink) {
        console.error("ButtonLogic: Debes proporcionar solo 'onClick' o 'urlLink', no ambos.");
        return null; // No renderiza nada si hay un error
    }

    // Definir estilos de botón según el tipo
    const buttonStyles = {
        primary: {
            backgroundColor: theme?.button?.cafeMedio || '#8B5E3B',
            color: 'white',
            borderRadius: theme?.button?.border?.corners || '8px',
            padding: '10px 20px',
            textTransform: 'none',
        },
        outlined: {
            borderColor: 'black',
            color: 'black',
            borderRadius: theme?.button?.border?.corners || '8px',
            padding: '10px 20px',
            textTransform: 'none',
        },
        secondary: {
            backgroundColor: theme?.button?.beige || '#F5DEB3',
            color: 'black',
            borderRadius: theme?.button?.border?.rounded || '8px',
            padding: '10px 20px',
            textTransform: 'none',
        }
    };

    if (onClick) {
        return (
            <Button
                fullWidth
                variant={typeButton === 'outlined' ? 'outlined' : 'contained'}
                sx={buttonStyles[typeButton]}
                onClick={onClick}
                style={{ zIndex: 10 }}
            >
                {text}
            </Button>
        );
    } else if (urlLink) {
        return (
            <Link to={urlLink} style={{ textDecoration: 'none', width: '100%' }}>
                <Button
                    fullWidth
                    variant={typeButton === 'outlined' ? 'outlined' : 'contained'}
                    sx={{ ...buttonStyles[typeButton], 
                        display: 'flex', gap: '10px',
                        zIndex: 10 }}
                >
                    {text}
                    {icon}
                </Button>
            </Link>
        );
    }

    return null;
};
