import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, Button, TextField } from '@mui/material';
import { ShoppingCart, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType } from '@/components';
import { PopUpInformation } from '@/components/decorator/PopUpInformation';
import { getOrderDishByOrderId } from '@/controller';

export const DivideInvoice = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedOption, setSelectedOption] = useState(texts.labels.amount);

    const handleOpenPopup = () => setOpenPopup(true);
    const handleClosePopup = () => setOpenPopup(false);
    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        handleClosePopup();
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (id) { // Verifica que el ID de la factura exista
            const fetchData = async () => {
                const orderDishes = await getOrderDishByOrderId(id);
                setOrder(orderDishes);
            };
            fetchData();
        }
    }, [id, location.search]);

    useEffect(() => {
        if (selectedOption === texts.labels.amount || selectedOption === texts.labels.dish) {
            setSelectedOption(texts.labels.amount);
        }
    }, [texts]);

    const calculateTotal = () => {
        if (!order) return { totalQuantity: 0, totalPrice: 0 };

        const totalQuantity = order.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const totalPrice = order.reduce((acc: number, dish: any) => acc + (dish.dish.price * dish.quantity), 0);

        return { totalQuantity, totalPrice };
    }

    const { totalQuantity, totalPrice } = calculateTotal();

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
                <Box sx={{ flex: 1, padding: '15px' }}>
                    <Grid container spacing={2} pb={2}>
                        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconText icon={<ShoppingCart />} text={texts.labels.dishes} />
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid white`,
                        borderRadius: theme.shape.borderRadius,
                        padding: '10px',
                        marginBottom: '20px',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.itemsCount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                {totalQuantity}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.totalAmount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                ${totalPrice.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Divicion de cuentas por monto o plato */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid white`,
                        borderRadius: theme.shape.borderRadius,
                        padding: '10px',
                        marginBottom: '20px',
                    }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            {texts.labels.divideBy}:
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleOpenPopup}
                            sx={{
                                padding: '5px 10px',
                                marginBottom: '10px',
                                borderRadius: `${theme.button.border.corners}`,
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: '3rem',
                            }}
                        >
                            <span style={{ flexGrow: 1, textAlign: 'left', color: 'black' }}>{selectedOption}</span>
                            <ArrowDropDownIcon sx={{ color: 'black' }} />
                        </Button>
                        <PopUpInformation
                            open={openPopup}
                            title={`${texts.labels.divideBy}:`}
                            message=""
                            isInformative={false}
                            redirect=""
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '15rem',
                                padding: '10px',
                                borderRadius: theme.button.border.corners,
                            }}>
                                <ButtonType
                                    text={texts.labels.amount}
                                    typeButton="outlined"
                                    onClick={() => {
                                        handleSelectOption(texts.labels.amount);
                                    }}
                                />
                                <br />
                                <ButtonType
                                    text={texts.labels.dish}
                                    typeButton="outlined"
                                    onClick={() => {
                                        handleSelectOption(texts.labels.dish);
                                    }}
                                />
                            </Box>
                        </PopUpInformation>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            {texts.labels.howManyPeople}:
                        </Typography>
                        <TextField
                            type="number"
                            placeholder={texts.placeholders.enterPeopleCount}
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: theme.background.primary,
                                borderRadius: theme.button.border.corners,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.button.border.color,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.button.border.color,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.button.border.color,
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    marginTop: 'auto',
                    width: '100%',
                    bottom: '0',
                }}>
                    <Box sx={{
                        borderRadius: theme.shape.borderRadius,
                        borderTop: '2px solid white',
                        padding: '10px',
                    }}>
                        <Box sx={{ marginBottom: '10px' }}>
                            <ButtonType
                                text={texts.buttons.continue}
                                typeButton="primary"
                                onClick={() => {
                                    console.log('Realizar pedido');
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.back}
                                typeButton="outlined"
                                urlLink={`/invoice/${id}?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
