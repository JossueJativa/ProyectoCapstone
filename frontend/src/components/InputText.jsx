import { TextField, Box } from "@mui/material";

export const InputText = ({ label, name, value, onChange, isPassword = false, isRequired = false, isNumber = false }) => {
  return (
    <Box mb={2}>
      <TextField
        label={label}
        variant="outlined"
        type={isPassword ? "password" : "text"}
        datatype={isNumber ? "number" : "text"}
        fullWidth
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
        value={value}
        required={isRequired}
      />
    </Box>
  );
};
