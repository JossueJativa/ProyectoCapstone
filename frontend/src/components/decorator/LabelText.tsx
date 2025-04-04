import { Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { ILabelTextProps } from '@/interfaces';

export const LabelText: FC<ILabelTextProps> = ({ typeText = 'title', text }) => {
    const theme = useTheme();

    // Define a mapping of supported types to MUI typography variants
    const variantMapping = {
        title: 'h4',
        subtitle: 'h6',
        body1: 'body1',
        body2: 'body2',
    };

    // Get the corresponding variant or default to 'h4'
    const variant = variantMapping[typeText] || 'h4';

    return (
        <Typography
            variant={variant}
            sx={{
                color: 'black',
                fontWeight: theme.typography[variant]?.fontWeight,
                fontSize: theme.typography[variant]?.fontSize,
                textAlign: 'center',
            }}
        >
            {text}
        </Typography>
    );
};
