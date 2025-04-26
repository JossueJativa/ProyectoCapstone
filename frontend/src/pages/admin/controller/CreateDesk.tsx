import { Grid, Box, useTheme, TextField, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { 
    getDesk, createDesk, 
    updateDesk, deleteDesk 
} from '@/controller';

export const CreateDesk = () => {
    const theme = useTheme();
    const [desk, setDesk] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [newDesk, setNewDesk] = useState({ number: '', capacity: '' });
    const [selectedDesk, setSelectedDesk] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchDesk = async () => {
            const response = await getDesk(selectedMonth);
            const sortedDesks = response.sort((a: any, b: any) => a.desk_number - b.desk_number); // Ordenar por número de mesa
            setDesk(sortedDesks);
        };
        fetchDesk();
    }, [selectedMonth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDesk({ ...newDesk, [name]: value });
    };

    const handleCreateDesk = async () => {
        if (newDesk.number && newDesk.capacity) {
            await createDesk(newDesk);
            setNewDesk({ number: '', capacity: '' });
            const response = await getDesk(selectedMonth);
            const sortedDesks = response.sort((a: any, b: any) => a.desk_number - b.desk_number); // Ordenar por número de mesa
            setDesk(sortedDesks);
        }
    };

    const handleUpdateDesk = async () => {
        if (selectedDesk && newDesk.number && newDesk.capacity) {
            const data = {
                id: selectedDesk.id,
                number: newDesk.number,
                capacity: newDesk.capacity
            };
            await updateDesk(data);
            setNewDesk({ number: '', capacity: '' });
            setSelectedDesk(null);
            setIsEditing(false);
            const response = await getDesk(selectedMonth);
            const sortedDesks = response.sort((a: any, b: any) => a.desk_number - b.desk_number); // Ordenar por número de mesa
            setDesk(sortedDesks);
        } else {
            console.error('Error: selectedDesk or its id is undefined');
        }
    };

    const handleDeskClick = (desk: any) => {
        setNewDesk({ number: desk.desk_number, capacity: desk.capacity });
        setSelectedDesk(desk); // Asegurarse de que el objeto completo se pase correctamente
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewDesk({ number: '', capacity: '' });
        setSelectedDesk(null);
        setIsEditing(false);
    };

    const handleDeleteDesk = async (id: number) => {
        await deleteDesk(id);
        const response = await getDesk(selectedMonth);
        const sortedDesks = response.sort((a: any, b: any) => a.desk_number - b.desk_number); // Ordenar por número de mesa
        setDesk(sortedDesks);
    };

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
                    {/* Parte izquierda: Crear mesas */}
                    <Box sx={{ width: '80%', padding: '10px', borderRight: '1px solid #ccc' }}>
                        <h3>{isEditing ? 'Editar Mesa' : 'Crear Mesa'}</h3>
                        <TextField
                            label="Número de Mesa"
                            name="number"
                            value={newDesk.number}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Capacidad"
                            name="capacity"
                            value={newDesk.capacity}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={isEditing ? handleUpdateDesk : handleCreateDesk}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear Mesa'}
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

                    {/* Parte derecha: Ver mesas */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowX: 'auto', // Habilita el desplazamiento solo en la parte derecha
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px', // Sin márgenes automáticos entre las cajas
                            // Cambiar a 1 columna en pantallas pequeñas
                            [theme.breakpoints.down('sm')]: {
                                gridTemplateColumns: '1fr',
                            },
                        }}
                    >
                        {desk.map((d, index) => (
                            <Box
                                key={index}
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    backgroundColor: '#f9f9f9',
                                    height: '80px', // Altura fija de cada cuadro
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleDeskClick(d)}
                            >
                                <Delete
                                    sx={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                    onClick={() => handleDeleteDesk(d.id)}
                                />
                                <p><strong>Mesa {d.desk_number}</strong></p>
                                <p>Capacidad: {d.capacity}</p>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};