import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { RoomService } from '@mui/icons-material';
import { Box, Grid, Typography, useTheme, Fade } from '@mui/material';

import { useSocket, useLanguage } from "@/helpers";
import { IconText, DishBox, CartButton, CategoriesList } from '@/components';
import { getDishes, getCategories } from '@/controller';

export const Menu = () => {
    const { texts } = useLanguage();
    const { socket } = useSocket();
    const theme = useTheme();
    const location = useLocation();
    const [dishes, setDishes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [visibleDishes, setVisibleDishes] = useState<number>(10); // Número inicial de platos visibles
    const [deskId, setDeskId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (socket && desk_id) {
            const handleDeskNotification = (notification: any) => {
                console.log(`📢 Notification for desk_${desk_id}:`, notification);
            };

            socket.on(`desk:notification:${desk_id}`, handleDeskNotification);

            return () => {
                socket.off(`desk:notification:${desk_id}`, handleDeskNotification);
            };
        }
    }, [socket, location.search]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = await getCategories(); // Asegurarse de esperar la promesa
                setCategories(categoriesList);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchDishes = async () => {
            try {
                const dishesList = await getDishes();
                setDishes(dishesList);
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        };

        fetchDishes();
        fetchCategories();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleDishes((prev) => Math.min(prev + 10, dishes.length)); // Cargar 10 más
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [dishes]);

    const handleCategorySelect = async (categoryId: number) => {
        console.log("Selected Category ID:", categoryId);
        try {
            if (selectedCategory === categoryId) {
                // Si la categoría seleccionada ya está activa, deseleccionarla
                const dishesList = await getDishes(); // Obtener todos los platos
                setDishes(dishesList);
                setVisibleDishes(10); // Reiniciar el número de platos visibles
                setSelectedCategory(null); // Deseleccionar la categoría
            } else {
                const dishesList = await getDishes(); // Realizar una nueva solicitud a la API
                const filteredDishes = dishesList.filter((dish) => dish.category === categoryId);
                console.log("Filtered Dishes:", filteredDishes);
                setDishes(filteredDishes); // Actualizar los platos filtrados
                setVisibleDishes(10); // Reiniciar el número de platos visibles
                setSelectedCategory(categoryId); // Establecer la nueva categoría seleccionada
            }
        } catch (error) {
            console.error("Error fetching dishes for category:", error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <Grid container spacing={2} pb={2}>
                    <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconText icon={<RoomService />} text={texts.labels.dishes} />
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: theme.background.primary,
                            borderRadius: theme.shape.borderRadius,
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.body1.fontWeight,
                                padding: '3px',
                            }}>
                                {deskId ? `${texts.labels.desk}: ${deskId}` : `${texts.labels.noDesk}`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                
                <CategoriesList categories={categories} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

                {/* Mostrar los platos con animación */}
                <Grid container spacing={2}>
                    {dishes.slice(0, visibleDishes).map((d, index) => (
                        <Grid item xs={12} key={d.id}>
                            <Fade in={index < visibleDishes} timeout={500}>
                                <DishBox
                                    name={d.dish_name}
                                    price={d.price}
                                    description={d.description}
                                    linkAR={d.link_ar}
                                    linkTo={`/dish/${d.id}?desk_id=${deskId}`}
                                    dish_id={d.id}
                                    has_garrison={d.has_garrison}
                                />
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Observador para cargar más platos */}
                <div ref={observerRef} style={{ height: '2px' }} />
            </Box>
            <CartButton />
        </>
    );
};
