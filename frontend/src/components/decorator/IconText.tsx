import { Typography } from '@mui/material';
import { FC } from 'react';
import { IIConTextProps } from '@/interfaces';

export const IconText:FC<IIConTextProps> = ({ icon, text }) => {
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
