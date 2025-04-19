import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, useTheme, Typography, Button } from "@mui/material";
import { ViewInAr, VolumeUp } from "@mui/icons-material";

import { AllergensList } from "./AllergensList";
import { useLanguage, useSocket } from "@/helpers";
import { useCart } from "@/context/CartContext";
import { ButtonLogic, PopUpInformation } from "@/components";
import { IDishBoxProps } from "@/interfaces";
import { getGarrisonsByDish } from '@/controller';

export const DishBox = React.forwardRef<HTMLDivElement, IDishBoxProps>(
  ({ name, price, description, linkAR, linkTo, allergens, dish_id, has_garrison }, ref) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { texts, language } = useLanguage();
    const { socket } = useSocket();
    const location = useLocation();
    const { syncCart } = useCart();
    const [popupOpen, setPopupOpen] = useState(false);
    const [garrisons, setGarrisons] = useState<any[]>([]);
    const [selectedGarrisons, setSelectedGarrisons] = useState<any[]>([]);

    const handleAddDish = async (dish_id: number) => {
      const params = new URLSearchParams(location.search);
      const desk_id = params.get("desk_id");

      if (!socket || !desk_id || !dish_id) return;

      socket.emit('order:create', {
        product_id: dish_id,
        quantity: 1,
        desk_id: desk_id,
        garrisons: null
      }, (error: any, response: any) => {
        if (error) {
          return;
        }
        syncCart();
      });
    };

    const handleGarrisonSelection = (garrison: any) => {
      setSelectedGarrisons((prev) => {
        if (prev.includes(garrison)) {
          return prev.filter((item) => item !== garrison);
        }
        if (prev.length < 2) {
          return [...prev, garrison];
        }
        return prev;
      });
    };

    const handleAddDishWithGarrisons = () => {
      const params = new URLSearchParams(location.search);
      const desk_id = params.get("desk_id");

      if (!socket || !desk_id || !dish_id) return;

      const parseIdGarrisons = selectedGarrisons.map((garrison) => garrison.id);
      socket.emit(
        'order:create', {
        product_id: dish_id,
        quantity: 1,
        desk_id: desk_id,
        garrison: parseIdGarrisons
      },
        (error: any, response: any) => {
          if (error) {
            console.error("Error adding dish with garrisons:", error);
            return;
          }
          syncCart();
          setPopupOpen(false);
          setSelectedGarrisons([]);
        }
      );
    };

    useEffect(() => {
      const fetchGarrisons = async () => {
        if (has_garrison) {
          const lang = language === "en" ? "EN-GB" : "ES";
          const garrisons = await getGarrisonsByDish(dish_id, lang);
          setGarrisons(garrisons);
        }
      };

      fetchGarrisons();
    }, [has_garrison, language]);

    const speakText = (text: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-GB" : "es-ES";
      synth.cancel();
      synth.speak(utterance);
    };

    return (
      <>
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
            <AllergensList
              allergens={allergens}
              allergenTexts={texts.allergens}
            />
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
                onClick={() => speakText(`${name}. ${description}`)}
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
                onClick={() => {
                  if (has_garrison) {
                    setPopupOpen(true);
                  } else {
                    handleAddDish(dish_id);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* PopUpInformation */}
        <PopUpInformation
          open={popupOpen}
          title={texts.popups.select}
          isInformative={false}
        >
          {/* Poner los garrisons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {garrisons.map((garrison) => (
              <Button
                key={garrison.id}
                variant={selectedGarrisons.includes(garrison) ? "contained" : "outlined"}
                onClick={() => handleGarrisonSelection(garrison)}
                sx={{
                  mb: 1,
                  width: "100%",
                  textTransform: "none",
                  backgroundColor: selectedGarrisons.includes(garrison)
                    ? theme.button.cafeMedio
                    : "transparent",
                  color: selectedGarrisons.includes(garrison)
                    ? theme.palette.common.white
                    : theme.palette.text.primary,
                  borderColor: theme.button.cafeMedio,
                }}
              >
                {garrison.name}
              </Button>
            ))}
            {selectedGarrisons.length === 2 && (
              <ButtonLogic
                text={texts.buttons.add}
                typeButton="primary"
                onClick={handleAddDishWithGarrisons}
              />
            )}
          </Box>
        </PopUpInformation>
      </>
    );
  }
);
