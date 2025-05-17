import { Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { ILabelTextProps } from '@/interfaces';

export const LabelText: FC<ILabelTextProps> = ({ typeText = 'title', text }) => {
    const theme = useTheme();

<<<<<<< HEAD
=======
    // Define a mapping of supported types to MUI typography variants
>>>>>>> 24a2e6b7b01bd1ed706a6b31422c051b23dea57f
    const variantMapping: Record<'title' | 'subtitle' | 'body1' | 'body2', 'h4' | 'h6' | 'body1' | 'body2'> = {
        title: 'h4',
        subtitle: 'h6',
        body1: 'body1',
        body2: 'body2',
    };

<<<<<<< HEAD
    const variant: 'h4' | 'h6' | 'body1' | 'body2' = variantMapping[typeText] || 'h4';

=======
    // Get the corresponding variant or default to 'h4'
    const variant: 'h4' | 'h6' | 'body1' | 'body2' = variantMapping[typeText] || 'h4';

    // Map customTypography keys to the correct type
>>>>>>> 24a2e6b7b01bd1ed706a6b31422c051b23dea57f
    const customTypographyKey = typeText as keyof typeof theme.customTypography;

    return (
        <Typography
            variant={variant}
            sx={{
                color: 'black',
                fontWeight: theme.customTypography[customTypographyKey]?.fontWeight,
                fontSize: theme.customTypography[customTypographyKey]?.fontSize,
                textAlign: 'center',
            }}
        >
            {text}
        </Typography>
    );
};
