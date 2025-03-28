import React from "react";
import { Box, Grid, useTheme, Typography } from "@mui/material";
import { ViewInAr, VolumeUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/helpers"; // Adjust the import path as necessary
import {
  Grain,
  Restaurant,
  Egg,
  SetMeal,
  EmojiFoodBeverage,
  Spa,
  LocalDrink,
  AcUnit,
  Grass,
  Star,
  Opacity,
  FilterVintage,
  Pets,
  Waves,
  CheckCircle,
} from "@mui/icons-material"; // Replace Fish with SetMeal

import { ButtonLogic } from "@/components";

interface DishBoxProps {
  name: string;
  price: number;
  description: string;
  linkAR: string;
  linkTo: string | null;
  allergens: string[] | null;
}

const allergenIcons: Record<string, JSX.Element> = {
  "1": <Grain />, // Gluten
  "2": <Restaurant />, // Crustaceos
  "3": <Egg />, // Huevos
  "4": <SetMeal />, // Pescados (replaced Fish with SetMeal)
  "5": <EmojiFoodBeverage />, // Cacahuates
  "6": <Spa />, // Soja
  "7": <LocalDrink />, // Lacteos
  "8": <AcUnit />, // Frutos con cascara
  "9": <Grass />, // Apio
  "10": <Star />, // Mostaza
  "11": <Opacity />, // Sesamo
  "12": <FilterVintage />, // Sulfitos
  "13": <Pets />, // Altramuces
  "14": <Waves />, // Moluscos
  15: <CheckCircle />, // No tiene
};

export const DishBox = React.forwardRef<HTMLDivElement, DishBoxProps>(
  ({ name, price, description, linkAR, linkTo, allergens }, ref) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { texts } = useLanguage(); // Obtén los textos traducidos
    const { allergens: allergensText } = texts; // Accede a los textos de alérgenos

    const allergenNames: Record<string, string> = {
      "1": allergensText.gluten,
      "2": allergensText.crustaceans,
      "3": allergensText.eggs,
      "4": allergensText.fish,
      "5": allergensText.peanuts,
      "6": allergensText.soy,
      "7": allergensText.milk,
      "8": allergensText.nuts,
      "9": allergensText.celery,
      "10": allergensText.mustard,
      "11": allergensText.sesame,
      "12": allergensText.sulphur,
      "13": allergensText.lupin,
      "14": allergensText.molluscs,
      "15": allergensText.none,
    };

    return (
      <Box
        ref={ref}
        sx={{
          backgroundColor: theme.background.primary,
          borderRadius: theme.shape.borderRadius,
          padding: "10px",
        }}
      >
        {/* Nombre y precio del producto */}
        <Grid container spacing={2} pb={2}>
          <Grid
            item
            xs={9}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.menu.black,
                fontSize: "1.2rem",
                fontWeight: theme.typography.title.fontWeight,
              }}
            >
              {name}
            </Typography>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.button.cafeMedio,
                fontSize: theme.typography.body1.fontSize,
                fontWeight: theme.typography.title.fontWeight,
              }}
            >
              $ {price.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        {/* Descripción del plato */}
        <Box
          {...(linkTo && { onClick: () => navigate(linkTo) })}
          sx={{
            pb: 2,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.menu.black,
              fontSize: theme.typography.body1.fontSize,
              fontWeight: theme.typography.body1.fontWeight,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            height: "200px",
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            overflow: "hidden",
            backgroundColor: theme.background.secondary,
            boxShadow: theme.shadows[2],
          }}
        >
          <iframe
            src={linkAR}
            title={name}
            width="100%"
            height="100%"
            frameBorder="0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking;"
          />
        </Box>

        {allergens && allergens.length > 0 && (
          <Grid container spacing={2} pb={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.menu.black,
                  fontSize: theme.typography.body1.fontSize,
                  fontWeight: theme.typography.body1.fontWeight,
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
                    .filter((allergen) => allergen !== 15) // Excluye "15" si hay otros alérgenos
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
        )}

        {/* Botón AR y lectura en voz alta */}
        <Grid container spacing={2} pb={2}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <ButtonLogic
              text={texts.buttons.ar}
              typeButton="secondary"
              urlLink={linkAR}
              icon={<ViewInAr />}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <ButtonLogic
              text={texts.buttons.read}
              typeButton="secondary"
              onClick={() => console.log("Button pressed")}
              icon={<VolumeUp />}
            />
          </Grid>
        </Grid>

        {/* Botón para agregar al carrito */}
        <Grid container spacing={2} pb={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <ButtonLogic
              text={texts.buttons.add}
              typeButton="primary"
              onClick={() => console.log("Button pressed")}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
);
