import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
    Grain, Restaurant, Egg,
    SetMeal, EmojiFoodBeverage,
    Spa, LocalDrink, AcUnit,
    Grass, Star, Opacity,
    FilterVintage, Pets,
    Waves, CheckCircle,
} from "@mui/icons-material";
import { useLanguage } from "@/helpers";
import { IAllergensListProps } from "@/interfaces";

const allergenIcons: Record<number, JSX.Element> = {
    1: <Grain />, // Gluten
    2: <Restaurant />, // Crustaceos
    3: <Egg />, // Huevos
    4: <SetMeal />, // Pescados
    5: <EmojiFoodBeverage />, // Cacahuates
    6: <Spa />, // Soja
    7: <LocalDrink />, // Lacteos
    8: <AcUnit />, // Frutos con cascara
    9: <Grass />, // Apio
    10: <Star />, // Mostaza
    11: <Opacity />, // Sesamo
    12: <FilterVintage />, // Sulfitos
    13: <Pets />, // Altramuces
    14: <Waves />, // Moluscos
    15: <CheckCircle />, // No tiene
};

const getAllergenNames = (allergenTexts: IAllergensListProps["allergenTexts"]): Record<number, string> => ({
    1: allergenTexts.gluten,
    2: allergenTexts.crustaceans,
    3: allergenTexts.eggs,
    4: allergenTexts.fish,
    5: allergenTexts.peanuts,
    6: allergenTexts.soy,
    7: allergenTexts.milk,
    8: allergenTexts.nuts,
    9: allergenTexts.celery,
    10: allergenTexts.mustard,
    11: allergenTexts.sesame,
    12: allergenTexts.sulphur,
    13: allergenTexts.lupin,
    14: allergenTexts.molluscs,
    15: allergenTexts.none,
});

export const AllergensList: React.FC<IAllergensListProps> = ({
    allergens,
    allergenTexts,
}) => {
    const allergenNames = getAllergenNames(allergenTexts);
    const { texts } = useLanguage();

    return (
        <Grid container spacing={2} pb={2}>
            <Grid item xs={12}>
                <Typography
                    variant="body1"
                    sx={{
                        color: "black", // Replace with theme color if needed
                        fontSize: "1rem", // Replace with theme typography if needed
                        fontWeight: "bold", // Replace with theme typography if needed
                    }}
                >
                    {texts.labels.allergens}:
                </Typography>
                <Grid container spacing={2} mt={1}>
                    {allergens.length === 1 && allergens[0] === 15 ? (
                        <Grid item xs="auto">
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                }}
                            >
                                {allergenIcons[15]}
                                <Typography>{allergenNames[15]}</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        allergens
                            .filter((allergen) => allergen !== 15)
                            .map((allergen) => (
                                <Grid item xs="auto" key={allergen}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        {allergenIcons[allergen]}
                                        <Typography>{allergenNames[allergen]}</Typography>
                                    </Box>
                                </Grid>
                            ))
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};
