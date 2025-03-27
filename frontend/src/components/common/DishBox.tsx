import { Box, Grid, useTheme, Typography } from "@mui/material";
import { ViewInAr, VolumeUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

import { ButtonLogic } from "@/components";

interface DishBoxProps {
  name: string;
  price: number;
  description: string;
  arEmbebed: string;
  linkAR: string;
  linkTo: string;
}

export const DishBox: FC<DishBoxProps> = ({
  name,
  price,
  description,
  linkAR,
  linkTo,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
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
            $ {price}
          </Typography>
        </Grid>
      </Grid>

      {/* Descripción del plato */}
      <Box
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

      {/* Mostrar objeto con redirección usando navigate */}
      <Box
        onClick={() => navigate(linkTo)}
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
          frameborder="0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking;"
        />
      </Box>

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
            text="Ver en AR"
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
            text="Leer en voz alta"
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
            text="Agregar al carrito"
            typeButton="primary"
            onClick={() => console.log("Button pressed")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
