import { Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { FC } from 'react';

interface ButtonTypeProps {
    text: string;
    typeButton: 'primary' | 'outlined' | 'secondary';
    urlLink?: string; // Make urlLink optional
    onClick?: () => void; // Add onClick callback
}

export const ButtonType: FC<ButtonTypeProps> = ({ text, typeButton, urlLink, onClick }) => {
    const theme = useTheme();

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
            color: 'white',
            borderRadius: theme?.button?.border?.rounded || '8px',
            padding: '10px 20px',
            textTransform: 'none',
        }
    };

    return urlLink ? (
        <Link to={urlLink} style={{ textDecoration: 'none' }}>
            <Button
                fullWidth
                variant={typeButton === 'outlined' ? 'outlined' : 'contained'}
                sx={buttonStyles[typeButton]}
            >
                {text}
            </Button>
        </Link>
    ) : (
        <Button
            fullWidth
            variant={typeButton === 'outlined' ? 'outlined' : 'contained'}
            sx={buttonStyles[typeButton]}
            onClick={onClick} // Use onClick if no urlLink
        >
            {text}
        </Button>
    );
};
