import { Box, Typography, IconButton, TextField, useTheme } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useLanguage, useSocket } from "@/helpers";
import { ButtonLogic } from "@/components";

interface CartBoxProps {
    id: number;
    dish_name: string;
    description: string;
    price: number;
    quantity: number;
    linkAR: string;
    desk_id: string | null;
    onQuantityChange: (id: number, newQuantity: number) => void; // Callback for quantity change
}

export const CartBox = ({ id, dish_name, description, price, quantity, linkAR, desk_id, onQuantityChange }: CartBoxProps) => {
    const theme = useTheme();
    const { texts } = useLanguage();
    const { socket } = useSocket();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || !desk_id) return; // Prevent invalid quantity or missing desk_id
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

    const handleDelete = () => {
        if (!desk_id) return;
        console.log("Emitting order:delete for order_detail_id:", id, "and desk_id:", desk_id); // Debug log
        socket.emit("order:delete", { order_detail_id: id, desk_id }, (error: any, response: any) => {
            if (error) {
                console.error("Error deleting item:", error);
            } else {
                console.log("Delete response:", response);
            }
        });
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
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
                >{dish_name}</Typography>
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
                        onClick={handleDelete}
                    />
                </Box>
                <Box width="55%" display="flex" justifyContent="center" alignItems="center">
                    <IconButton
                        color="primary"
                        sx={{ mx: 1 }}
                        onClick={() => {
                            if (quantity === 1) {
                                handleDelete(); // Delete the item if quantity is 1
                            } else {
                                handleQuantityChange(quantity - 1); // Decrease quantity otherwise
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
                onClick={() => console.log("View details")}
            />
        </Box>
    );
};
