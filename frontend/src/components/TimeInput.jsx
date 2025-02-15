import { TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";

export const TimeInput = ({ label = "Hora", name, value = "00:30", onChange, isRequired = false }) => {
    const [error, setError] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value || "00:30");
    }, [value]);

    const handleChange = (event) => {
        let newValue = event.target.value;

        // Expresión regular para validar formato hh:mm[:ss]
        const timeFormat = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;

        // Limitar la longitud a 8 caracteres
        if (newValue.length > 8) return;

        setInputValue(newValue); // Permite escribir carácter por carácter

        if (newValue === "" || timeFormat.test(newValue)) {
            setError(false);
            onChange({ target: { name, value: newValue } }); // Enviar el evento simulado
        } else {
            setError(true);
        }
    };

    return (
        <Box mb={2}>
            <TextField
                label={label}
                variant="outlined"
                type="text"
                fullWidth
                inputProps={{
                    maxLength: 8, // Máximo 8 caracteres
                }}
                InputProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: "#F5F5F5",
                    },
                }}
                InputLabelProps={{
                    sx: {
                        color: "#6C6C6C",
                        fontSize: "14px",
                    },
                }}
                error={error}
                helperText={error ? "Formato incorrecto: usa hh:mm o hh:mm:ss" : ""}
                onChange={handleChange}
                name={name}
                value={inputValue}
                required={isRequired}
                placeholder="hh:mm o hh:mm:ss"
            />
        </Box>
    );
};
