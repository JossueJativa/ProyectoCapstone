import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { IPopUpInformationProps } from '@/interfaces';
import { ButtonType } from '@/components';
import { useLanguage } from '@/helpers';

export const PopUpInformation = ({ open, title, message, isInformative, redirect }: IPopUpInformationProps) => {
    const { texts } = useLanguage();
    return (
        (
            isInformative ? (
                <Dialog open={open}>
                    <DialogTitle style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <CheckCircle color="success" fontSize="large" sx={{ width: '100%', fontSize: '3rem' }} />
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" gutterBottom sx={{ textAlign: 'left', fontSize: '0.8rem' }}>
                            {message}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ mb: 2, mx: 2 }}>
                        <Box width="100%">
                            <ButtonType
                                text={texts.buttons.accept}
                                typeButton="primary"
                                urlLink={redirect}
                            />
                        </Box>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={open}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <p>{message}</p>
                    </DialogContent>
                    <DialogActions>
                        <Box width="100%">
                            <ButtonType
                                text={texts.buttons.accept}
                                typeButton="primary"
                                urlLink={redirect}
                            />
                        </Box>
                    </DialogActions>
                </Dialog>
            )
        )
    );
};
