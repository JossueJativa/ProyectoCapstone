import { Typography } from '@mui/material';
import { FC } from 'react';

interface IconTextProps {
    icon: JSX.Element;
    text: string;
}

export const IconText:FC<IconTextProps> = ({ icon, text }) => {
    return (
        <Typography
            variant="body1"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}
        >
            {icon}
            {text}
        </Typography>
    )
}
