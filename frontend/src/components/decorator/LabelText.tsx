import { Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { ILabelTextProps } from '@/interfaces';

export const LabelText: FC<ILabelTextProps> = ({ typeText = 'title', text }) => {
    const theme = useTheme();

    const variantMapping: Record<'title' | 'subtitle' | 'body1' | 'body2', 'h4' | 'h6' | 'body1' | 'body2'> = {
        title: 'h4',
        subtitle: 'h6',
        body1: 'body1',
        body2: 'body2',
    };

    const variant: 'h4' | 'h6' | 'body1' | 'body2' = variantMapping[typeText] || 'h4';

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
