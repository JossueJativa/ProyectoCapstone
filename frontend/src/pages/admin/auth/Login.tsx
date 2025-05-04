import { Box, TextField, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonLogic } from '@/components';
import { LoginAuth } from '@/controller';
import { useLanguage } from "@/helpers";
import { Logo } from '@/assets';

export const Login = () => {
    const { texts } = useLanguage();
    const theme = useTheme();
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async () => {
        const response = await LoginAuth(data.username, data.password);
        if (response) {
            navigate('/admin/dashboard', { replace: true });
        } else {
            alert(texts.auth.errorLogin);
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: theme.background.secondary,
        }}>
            <Box sx={{
                width: '300px',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#fff',
                minWidth: '40vh'
            }}>
                <img src={Logo} alt="Logo" style={{
                    width: '100%',
                    marginBottom: '20px',
                    padding: '10px 40px'
                }} />
                <TextField
                    label={texts.auth.username}
                    value={data.username}
                    onChange={(e) => setData({ ...data, username: e.target.value })}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    required
                />
                <TextField
                    label={texts.auth.password}
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    required
                />
                <Box sx={{
                    padding: '10px 0px'
                }}>
                    <ButtonLogic
                        text={texts.auth.login}
                        typeButton="primary"
                        onClick={() => handleLogin()}
                    />
                </Box>
            </Box>
        </Box>
    )
}
