import { useState } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import { IconText, ButtonType, LabelText } from '@/components';
import { useLanguage } from "@/helpers";

const desk = Array.from({ length: 16 }, (_, i) => ({
    desk_number: i + 1,
    capacity: 4
}));

export const SelectDesk = () => {
    const { texts } = useLanguage();
    const theme = useTheme();

    const [selectedDesk, setSelectedDesk] = useState<number | null>(null);

    // Lista de colores del menú
    const menuColors = [
        theme.menu.mostaza,
        theme.menu.ladrillo,
        theme.menu.azul,
        theme.menu.verde
    ];

    const handleDeskClick = (deskNumber: number) => {
        setSelectedDesk(deskNumber);
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <IconText icon={<Restaurant />} text={texts.tables.welcome} />

                {/* Mostrar las mesas */}
                <Container sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    justifyItems: 'center',
                    gap: '10px',
                    backgroundColor: 'white',
                    borderRadius: theme.shape.borderRadius,
                    marginTop: '20px',
                    padding: '10px',
                    width: '100%'
                }}>
                    {/* Mesa a seleccionar */}
                    {desk.map((d, i) => {
                        const deskColor = menuColors[i % menuColors.length];
                        const isSelected = selectedDesk === d.desk_number;

                        return (
                            <Box
                                key={d.desk_number}
                                onClick={() => handleDeskClick(d.desk_number)}
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '70px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: isSelected ? `3px solid black` : `none`,
                                    borderRadius: theme.shape.borderRadius,
                                    margin: '5px',
                                    backgroundColor: deskColor,
                                    color: 'white',
                                    fontSize: theme.typography.body1.fontSize,
                                    fontWeight: theme.typography.body1.fontWeight,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        opacity: 0.8
                                    }
                                }}
                            >
                                {d.desk_number}
                            </Box>
                        );
                    })}
                </Container>
            </Box>
            {/* Botón para comenzar */}
            <Box sx={{
                marginTop: '20px',
                width: '100%',
            }}>
                {
                    selectedDesk !== null && (
                        <Box sx={{
                            borderRadius: theme.shape.borderRadius,
                            borderTop: '2px solid white',
                            padding: '10px',
                        }}>
                            <LabelText typeText="body1" text={`${texts.labels.selectedDesk} ${selectedDesk}`} />
                            <br />
                            <ButtonType text={texts.buttons.start} typeButton="primary" />
                        </Box>
                    )
                }
            </Box>
        </>
    );
};
