import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { RoomService } from '@mui/icons-material';
import { Box, Grid, Typography, useTheme, Fade } from '@mui/material';

import { useSocket, useLanguage } from "@/helpers";
import { IconText, DishBox, CartButton, CategoriesList } from '@/components';
import { getDishes, getCategories, getAllergensByDish } from '@/controller';

export const Menu = () => {
    const { texts, language } = useLanguage();
    const { socket } = useSocket();
    const theme = useTheme();
    const location = useLocation();
    const [dishes, setDishes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [visibleDishes, setVisibleDishes] = useState<number>(10);
    const [deskId, setDeskId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
                const lang = language === "en" ? "EN-GB" : "ES";
                const categoriesList = await getCategories(lang);
                setCategories(categoriesList);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [language]);

    useEffect(() => {
        const fetchDishesWithAllergens = async () => {
            try {
                const lang = language === "en" ? "EN-GB" : "ES";
                const dishesList = await getDishes(lang);
                // Obtener los alérgenos para cada plato
                const dishesWithAllergens = await Promise.all(
                    dishesList.map(async (d: any) => {
                        const allergens = await getAllergensByDish(String(d.id));
                        return { ...d, allergens };
                    })
                );
                setDishes(dishesWithAllergens);
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        };
        fetchDishesWithAllergens();
    }, [language]);

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

    const handleCategorySelect = async (categoryId: string) => {
        try {
            if (!categoryId || selectedCategory === categoryId) {
                // Si no hay categoría seleccionada o se deselecciona, mostrar todos los platos
                const lang = language === "en" ? "EN-GB" : "ES";
                const dishesList = await getDishes(lang);
                const dishesWithAllergens = await Promise.all(
                    dishesList.map(async (d: any) => {
                        const allergens = await getAllergensByDish(String(d.id));
                        return { ...d, allergens };
                    })
                );
                setDishes(dishesWithAllergens);
                setVisibleDishes(10);
                setSelectedCategory(null);
            } else {
                // Filtrar por categoría usando el id
                const lang = language === "en" ? "EN-GB" : "ES";
                const dishesList = await getDishes(lang);
                const filteredDishes = dishesList.filter((dish: { category: string | number }) => String(dish.category) === String(categoryId));
                const dishesWithAllergens = await Promise.all(
                    filteredDishes.map(async (d: any) => {
                        const allergens = await getAllergensByDish(String(d.id));
                        return { ...d, allergens };
                    })
                );
                setDishes(dishesWithAllergens);
                setVisibleDishes(10);
                setSelectedCategory(categoryId);
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
                            borderRadius: theme.button.border.corners
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
                                    allergens={null}
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
