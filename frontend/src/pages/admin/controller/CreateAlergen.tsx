import { Grid, Box, useTheme, TextField, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { 
    getAllergens, createAllergen, 
    updateAllergen, deleteAllergen 
} from '@/controller';

export const CreateAlergen = () => {
    const theme = useTheme();
    const [allergen, setAllergen] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [newAllergen, setNewAllergen] = useState({ allergen_name: '' });
    const [selectedAllergen, setSelectedAllergen] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAllergens = allergen.filter((a) =>
        a.allergen_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAllergen({ ...newAllergen, [name]: value });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateAllergen = async () => {
        if (newAllergen.allergen_name) {
            await createAllergen(newAllergen);
            setNewAllergen({ name: '' });
            const response = await getAllergens(selectedMonth);
            setAllergen(response.data);
        }
    };

    const handleUpdateAllergen = async () => {
        if (selectedAllergen && newAllergen.allergen_name) {
            const data = {
                id: selectedAllergen.id,
                name: newAllergen.allergen_name
            };
            await updateAllergen(data);
            setNewAllergen({ allergen_name: '' });
            setSelectedAllergen(null);
            setIsEditing(false);
            const response = await getAllergens(selectedMonth);
            setAllergen(response || []);
        }
    };

    const handleDeleteAllergen = async (id: number) => {
        await deleteAllergen(id);
        const response = await getAllergens(selectedMonth);
        setAllergen(response || []);
    };

    const handleAllergenClick = (allergen: any) => {
        setNewAllergen({ allergen_name: allergen.allergen_name });
        setSelectedAllergen(allergen);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewAllergen({ allergen_name: '' });
        setSelectedAllergen(null);
        setIsEditing(false);
    };

    useEffect(() => {
        const fetchAllergen = async () => {
            const response = await getAllergens(selectedMonth);
            setAllergen(response || []);
        };
        fetchAllergen();
    }, [selectedMonth]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: theme.background.primary,
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Crear alérgenos */}
                    <Box sx={{ width: '80%', padding: '10px', borderRight: '1px solid #ccc' }}>
                        <h3>{isEditing ? 'Editar Alérgeno' : 'Crear Alérgeno'}</h3>
                        <TextField
                            label="Nombre del Alérgeno"
                            name="allergen_name"
                            value={newAllergen.allergen_name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={isEditing ? handleUpdateAllergen : handleCreateAllergen}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear Alérgeno'}
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

                    {/* Parte derecha: Ver alérgenos */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column', // Mostrar un elemento debajo del otro
                            gap: '10px',
                        }}
                    >
                        <TextField
                            label="Buscar Alérgeno"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                            margin="normal"
                        />
                        {filteredAllergens.map((a: any, index: number) => (
                            <Box
                                key={index}
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    backgroundColor: '#f9f9f9',
                                    display: 'flex',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleAllergenClick(a)}
                            >
                                <Delete
                                    sx={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                    onClick={() => handleDeleteAllergen(a.id)}
                                />
                                <p><strong>{a.allergen_name}</strong></p>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
