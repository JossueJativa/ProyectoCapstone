import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

export const SelectList = ({ list, name, checked = [], onChange, labelKey = "name" }) => {
    return (
        <FormGroup>
            <Grid container spacing={2}>
                {list.map((item) => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={3} 
                        key={item.id}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={name}
                                    value={item.id}
                                    checked={checked.includes(item.id)}
                                    onChange={onChange}
                                />
                            }
                            label={item[labelKey]}
                        />
                    </Grid>
                ))}
            </Grid>
        </FormGroup>
    );
};
