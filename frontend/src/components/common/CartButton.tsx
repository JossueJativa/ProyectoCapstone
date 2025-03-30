import { Badge, Button, useTheme } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/helpers";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export const CartButton = () => {
    const theme = useTheme();
    const { cartCount, syncCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { texts } = useLanguage();

    useEffect(() => {
        syncCart();
    }, [syncCart]);

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={() => {
                navigate(`/cart?desk_id=${new URLSearchParams(location.search).get("desk_id")}`);
            }}
            style={{
                height: "50px",
                width: "200px",
                borderRadius: theme.button.border.corners,
                position: "fixed",
                bottom: 16,
                left: "47%",
                transform: "translateX(-50%)",
                backgroundColor: theme.button.beige,
                color: "#000",
                zIndex: 30,
            }}
        >
            {texts.buttons.cart}
            <Badge
                badgeContent={cartCount >= 1 ? cartCount : null}
                color="error"
                overlap="circular"
                sx={{ ml: 1 }}
            >
                <ShoppingCartIcon />
            </Badge>
        </Button>
    );
};
