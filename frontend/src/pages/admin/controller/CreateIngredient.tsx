import { Grid, Box, useTheme, TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { 
    getIngredients, getAllergens, createIngredient, 
    updateIngredient, deleteIngredient 
} from '@/controller';

export const CreateIngredient = () => {
    const theme = useTheme();
    const [ingredient, setIngredient] = useState<any[]>([]); // Inicializar como un array vacío
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [newIngredient, setNewIngredient] = useState<{ name: string; allergens: number[] }>({ name: '', allergens: [] });
    const [allergens, setAllergens] = useState<any[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIngredients = ingredient.filter((ing) =>
        ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const fetchIngredient = async () => {
            const response = await getIngredients();
            setIngredient(response || []); // Asegurarse de que sea un array
        };
        fetchIngredient();
    }, []);

    useEffect(() => {
        const fetchAllergens = async () => {
            const response = await getAllergens();
            setAllergens(response);
        };
        fetchAllergens();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewIngredient({ ...newIngredient, [name]: value });
    };

    const handleAllergenChange = (id: number) => {
        setNewIngredient((prev) => {
            const allergens = prev.allergens.includes(id)
                ? prev.allergens.filter((allergenId) => allergenId !== id)
                : [...prev.allergens, id];
            return { ...prev, allergens };
        });
    };

    const handleCreateIngredient = async () => {
        if (!newIngredient.name || newIngredient.allergens.length === 0) {
            alert('Debe ingresar un nombre y seleccionar al menos un alérgeno.');
            return;
        }
        await createIngredient(newIngredient);
        setNewIngredient({ name: '', allergens: [] });
        const response = await getIngredients(selectedMonth);
        setIngredient(response);
    };

    const handleUpdateIngredient = async () => {
        if (!newIngredient.name || newIngredient.allergens.length === 0) {
            alert('Debe ingresar un nombre y seleccionar al menos un alérgeno.');
            return;
        }
        const data = {
            id: selectedIngredient.id,
            name: newIngredient.name,
            quantity: selectedIngredient.quantity || 0, // Default quantity if not provided
            allergens: newIngredient.allergens
        };
        await updateIngredient(data);
        setNewIngredient({ name: '', allergens: [] });
        setSelectedIngredient(null);
        setIsEditing(false); // Desactivar modo edición
        const response = await getIngredients(selectedMonth);
        setIngredient(response || []); // Asegurarse de que sea un array
    };

    const handleDeleteIngredient = async (id: number) => {
        await deleteIngredient(id);
        const response = await getIngredients();
        setIngredient(response || []);
    };

    const handleIngredientClick = (ing: any) => {
        setNewIngredient({
            name: ing.ingredient_name,
            allergens: ing.allergen || [] // Mapear los alérgenos asociados
        });
        setSelectedIngredient(ing);
        setIsEditing(true); // Activar modo edición
    };

    const handleCancelEdit = () => {
        setNewIngredient({ name: '', allergens: [] });
        setSelectedIngredient(null);
        setIsEditing(false); // Desactivar modo edición
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Crear ingrediente */}
                    <Box sx={{ width: '70%', padding: '10px', borderRight: '1px solid #ccc' }}>
                        <h3>{selectedIngredient ? 'Editar Ingrediente' : 'Crear Ingrediente'}</h3>
                        <TextField
                            label="Nombre del Ingrediente"
                            name="name"
                            value={newIngredient.name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormGroup
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr', // 1 columna en pantallas pequeñas
                                    sm: 'repeat(3, 1fr)', // 3 columnas en pantallas más grandes
                                },
                                gap: '10px',
                            }}
                        >
                            {allergens.map((allergen) => (
                                <FormControlLabel
                                    key={allergen.id}
                                    control={
                                        <Checkbox
                                            checked={newIngredient.allergens.includes(allergen.id)}
                                            onChange={() => handleAllergenChange(allergen.id)}
                                        />
                                    }
                                    label={allergen.allergen_name}
                                />
                            ))}
                        </FormGroup>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={selectedIngredient ? handleUpdateIngredient : handleCreateIngredient}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {selectedIngredient ? 'Actualizar Ingrediente' : 'Crear Ingrediente'}
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

                    {/* Parte derecha: Ver ingredientes */}
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
                            label="Buscar Ingrediente"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                            margin="normal"
                        />
                        {filteredIngredients && filteredIngredients.length > 0 ? (
                            filteredIngredients.map((ing, index) => (
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
                                    onClick={() => handleIngredientClick(ing)}
                                >
                                    <p><strong>{ing.ingredient_name}</strong></p>
                                    <Delete
                                        sx={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            cursor: 'pointer',
                                            color: 'red',
                                        }}
                                        onClick={() => handleDeleteIngredient(ing.id)}
                                    />
                                </Box>
                            ))
                        ) : (
                            <p>No hay ingredientes disponibles.</p>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
