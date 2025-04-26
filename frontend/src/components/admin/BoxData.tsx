import React from 'react';
import { Box, useTheme } from '@mui/material';

export const BoxData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    
    return (
        <Box sx={{
            backgroundColor: theme.background.secondary,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '150px',
        }}>
            {children}
        </Box>
    )
}
