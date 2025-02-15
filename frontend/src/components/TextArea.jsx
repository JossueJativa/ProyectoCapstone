import { TextField, Box } from '@mui/material';

export const TextArea = ({ label, name, onChange, isRequired}) => {
    return (
        <Box mb={2}>
            <TextField
                label={label}
                variant="outlined"
                multiline
                fullWidth
                rows={4}
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
                onChange={onChange}
                name={name}
                required={isRequired}
            />
        </Box>
    )
}
