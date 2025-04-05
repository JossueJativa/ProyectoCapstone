import { Box, Typography, IconButton, TextField, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import { useLanguage, useSocket } from "@/helpers";
import { ButtonLogic } from "@/components";
import { ICartBoxProps } from "@/interfaces";

export const CartBox = ({ id, dish_name, description, price, quantity, linkAR, desk_id, linkTo, onQuantityChange, onDelete, garrisons }: ICartBoxProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { texts } = useLanguage();
    const { socket } = useSocket();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || !desk_id) return;
        console.log("Emitting order:update for order_detail_id:", id, "with new quantity:", newQuantity, "and desk_id:", desk_id); // Debug log
        socket.emit("order:update", { order_detail_id: id, desk_id, update_quantity: newQuantity }, (error: any, response: any) => {
            if (error) {
                console.error("Error updating quantity:", error);
            } else {
                console.log("Quantity update response:", response); // Debug log
                onQuantityChange(id, newQuantity); // Update state in parent
            }
        });
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: theme.button.border.corners,
                padding: "16px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                width: "100%",
            }}
        >
            {/* Título y precio */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.menu.black,
                        fontSize: "1.2rem",
                        fontWeight: theme.typography.title.fontWeight,
                    }}
                >
                    {dish_name}
                    {garrisons && garrisons.length > 0 && (
                        <Typography
                            component="span"
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: theme.typography.body1.fontWeight,
                                color: theme.palette.text.secondary,
                                marginLeft: "8px",
                            }}
                        >
                            ({garrisons})
                        </Typography>
                    )}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.button.cafeMedio,
                        fontSize: theme.typography.body1.fontSize,
                        fontWeight: theme.typography.title.fontWeight,
                    }}
                >${price.toFixed(2)}</Typography>
            </Box>

            {/* Descripción */}
            <Typography variant="body2" color="textSecondary" mt={1}>
                {description}
            </Typography>

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
                    title={dish_name}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking;"
                />
            </Box>

            {/* Controles de cantidad */}
            <Box display="flex" alignItems="center" mt={2} mb={2}>
                <Box width="45%">
                    <ButtonLogic
                        text={texts.labels.delete}
                        typeButton="secondary"
                        onClick={onDelete}
                    />
                </Box>
                <Box width="55%" display="flex" justifyContent="center" alignItems="center">
                    <IconButton
                        color="primary"
                        sx={{ mx: 1 }}
                        onClick={() => {
                            if (quantity === 1) {
                                onDelete(id);
                            } else {
                                handleQuantityChange(quantity - 1);
                            }
                        }}
                    >
                        <Remove />
                    </IconButton>
                    <TextField
                        value={quantity}
                        size="small"
                        sx={{ width: 70, textAlign: "center" }}
                        inputProps={{ style: { textAlign: "center" }, readOnly: true }}
                    />
                    <IconButton
                        color="primary"
                        sx={{ mx: 1 }}
                        onClick={() => handleQuantityChange(quantity + 1)}
                    >
                        <Add />
                    </IconButton>
                </Box>
            </Box>

            {/* Botón Ver detalles */}
            <ButtonLogic
                text={texts.labels.details}
                typeButton="primary"
                onClick={() => {
                    navigate(linkTo);
                }}
            />
        </Box>
    );
};
