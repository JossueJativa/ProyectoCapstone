import { useEffect, useState } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { Restaurant } from '@mui/icons-material';

import { IconText, ButtonType, LabelText } from '@/components';
import { useLanguage } from "@/helpers";
import { getDesk } from '@/controller';

export const SelectDesk = () => {
    const { texts } = useLanguage();
    const theme = useTheme();

    const [desk, setDesk] = useState<any[]>([]);

    useEffect(() => {
        const fetchDesks = async () => {
            const deskList = await getDesk();
            const sortedDeskList = deskList.sort((a: { desk_number: number; }, b: { desk_number: number; }) => a.desk_number - b.desk_number);
            setDesk(sortedDeskList);
        };
        fetchDesks();
    }, []);

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
                <Typography variant="h6" sx={{
                    color: theme.menu.black,
                    fontSize: theme.typography.body1.fontSize,
                    fontWeight: theme.typography.body1.fontWeight,
                    marginTop: '20px',
                }}>
                    {texts.tables.select}
                </Typography>
                <Container sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    justifyItems: 'center',
                    gap: '10px',
                    backgroundColor: 'white',
                    borderRadius: theme.button.border.corners,
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
                                    borderRadius: theme.button.border.corners,
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
                position: 'fixed',
                bottom: '0',
            }}>
                {
                    selectedDesk !== null && (
                        <Box sx={{
                            borderRadius: theme.button.border.corners,
                            borderTop: '2px solid white',
                            padding: '10px',
                        }}>
                            <LabelText typeText="body1" text={`${texts.labels.selectedDesk} ${selectedDesk}`} />
                            <br />
                            <ButtonType text={texts.buttons.start} typeButton="primary" urlLink={`/menu?desk_id=${selectedDesk}`} />
                        </Box>
                    )
                }
            </Box>
        </>
    );
};
