import { Grid, Box, useTheme, TextField, Button, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { 
    getGarrisons, createGarrison, getDishes,
    updateGarrison, deleteGarrison
} from '@/controller';

export const CreateGarrisons = () => {
    const theme = useTheme();
    const [garrisons, setGarrisons] = useState<any[]>([]);
    const [dishes, setDishes] = useState<any[]>([]);
    const [newGarrison, setNewGarrison] = useState<{ garrison_name: string; dish: number[] }>({ garrison_name: '', dish: [] });
    const [selectedGarrison, setSelectedGarrison] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDishes = dishes.filter((dish) =>
        dish.dish_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGarrisons = garrisons.filter((garrison) =>
        garrison.garrison_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchGarrisons = async () => {
            const response = await getGarrisons();
            setGarrisons(response);
        };
        fetchGarrisons();

        const fetchDishes = async () => {
            const response = await getDishes();
            const filteredDishes = response.filter((dish: any) => dish.has_garrison);
            setDishes(filteredDishes);
        };
        fetchDishes();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewGarrison({ ...newGarrison, [name]: value });
    };

    const handleDishChange = (id: number) => {
        setNewGarrison((prev) => {
            const dish = prev.dish.includes(id)
                ? prev.dish.filter((dishId) => dishId !== id)
                : [...prev.dish, id];
            return { ...prev, dish };
        });
    };

    const handleCreateGarrison = async () => {
        if (!newGarrison.garrison_name) {
            alert('Debe ingresar un nombre para la guarnición.');
            return;
        }
        await createGarrison(newGarrison);
        setNewGarrison({ garrison_name: '', dish: [] });
        const response = await getGarrisons();
        setGarrisons(response);
    };

    const handleUpdateGarrison = async () => {
        if (!newGarrison.garrison_name) {
            alert('Debe ingresar un nombre para la guarnición.');
            return;
        }
        const data = {
            id: selectedGarrison.id,
            garrison_name: newGarrison.garrison_name,
            dish: newGarrison.dish
        };
        await updateGarrison(data);
        setNewGarrison({ garrison_name: '', dish: [] });
        setSelectedGarrison(null);
        setIsEditing(false);
        const response = await getGarrisons();
        setGarrisons(response);
    };

    const handleDeleteGarrison = async (id: number) => {
        await deleteGarrison(id);
        const response = await getGarrisons();
        setGarrisons(response);
    };

    const handleGarrisonClick = (garrison: any) => {
        setNewGarrison({
            garrison_name: garrison.garrison_name,
            dish: garrison.dish || []
        });
        setSelectedGarrison(garrison);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewGarrison({ garrison_name: '', dish: [] });
        setSelectedGarrison(null);
        setIsEditing(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Crear guarnición */}
                    <Box sx={{ width: '70%', padding: '10px', borderRight: '1px solid #ccc' }}>
                        <h3>{selectedGarrison ? 'Editar Guarnición' : 'Crear Guarnición'}</h3>
                        <TextField
                            label="Nombre de la Guarnición"
                            name="garrison_name"
                            value={newGarrison.garrison_name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <h4>Platos</h4>
                        <TextField
                            label="Buscar Plato"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormGroup
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(3, 1fr)',
                                },
                                gap: '10px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                marginBottom: '10px',
                            }}
                        >
                            {filteredDishes.map((dish) => (
                                <FormControlLabel
                                    key={dish.id}
                                    control={
                                        <Checkbox
                                            checked={newGarrison.dish.includes(dish.id)}
                                            onChange={() => handleDishChange(dish.id)}
                                        />
                                    }
                                    label={dish.dish_name}
                                />
                            ))}
                        </FormGroup>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={selectedGarrison ? handleUpdateGarrison : handleCreateGarrison}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {selectedGarrison ? 'Actualizar Guarnición' : 'Crear Guarnición'}
                        </Button>
                        {isEditing && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelEdit}
                                fullWidth
                                sx={{ marginTop: '10px' }}
                            >
                                Cancelar
                            </Button>
                        )}
                    </Box>

                    {/* Parte derecha: Ver guarniciones */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <TextField
                            label="Buscar Guarnición"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ marginBottom: '10px' }}
                        />
                        {filteredGarrisons && filteredGarrisons.length > 0 ? (
                            filteredGarrisons.map((garrison, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        backgroundColor: '#f9f9f9',
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleGarrisonClick(garrison)}
                                >
                                    <p><strong>{garrison.garrison_name}</strong></p>
                                    <Delete
                                        sx={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            cursor: 'pointer',
                                            color: 'red',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteGarrison(garrison.id);
                                        }}
                                    />
                                </Box>
                            ))
                        ) : (
                            <p>No hay guarniciones disponibles.</p>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
