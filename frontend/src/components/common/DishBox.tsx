import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, useTheme, Typography } from "@mui/material";
import { ViewInAr, VolumeUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage, useSocket } from "@/helpers";
import { useCart } from "@/context/CartContext";
import { AllergensList } from "./AllergensList";

import { ButtonLogic } from "@/components";

interface DishBoxProps {
  name: string;
  price: number;
  description: string;
  linkAR: string;
  linkTo: string | null;
  allergens: number[] | null;
  dish_id: number;
}

export const DishBox = React.forwardRef<HTMLDivElement, DishBoxProps>(
  ({ name, price, description, linkAR, linkTo, allergens, dish_id }, ref) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { texts } = useLanguage();
    const { socket } = useSocket();
    const location = useLocation();
    const { syncCart } = useCart();

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const desk_id = params.get("desk_id");

      if (socket && desk_id) {
        const handleDeskNotification = (notification: any) => {
          console.log(`📢 Notification for desk_${desk_id}:`, notification);
        };

        socket.on(`desk:notification:${desk_id}`, handleDeskNotification);

        return () => {
          socket.off(`desk:notification:${desk_id}`, handleDeskNotification);
        };
      }
    });

    const handleAddDish = async (dish_id: number) => {
      const params = new URLSearchParams(location.search);
      const desk_id = params.get("desk_id");

      if (!socket || !desk_id || !dish_id) return;

      socket.emit('order:create', { product_id: dish_id, quantity: 1, desk_id: desk_id }, (error: any, response: any) => {
        if (error) {
          return;
        }
        syncCart(); // Sync cart after adding a dish
      });
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
              onClick={() => handleAddDish(dish_id)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
);
