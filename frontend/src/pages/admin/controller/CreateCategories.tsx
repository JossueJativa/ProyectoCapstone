import { Grid, Box, useTheme, TextField, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/controller';

export const CreateCategories = () => {
    const theme = useTheme();
    const [categories, setCategories] = useState<any>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [newCategory, setNewCategory] = useState({ category_name: '' });
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            setCategories(response);
        }
        fetchCategories();
    }, [selectedMonth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleCreateCategory = async () => {
        if (newCategory.category_name) {
            await createCategory(newCategory);
            setNewCategory({ category_name: '' });
            const response = await getCategories(selectedMonth);
            setCategories(response.data);
        }
    };

    const handleUpdateCategory = async () => {
        if (selectedCategory && newCategory.category_name) {
            const data = {
                id: selectedCategory.id,
                name: newCategory.category_name
            };
            await updateCategory(data);
            setNewCategory({ category_name: '' });
            setSelectedCategory(null);
            setIsEditing(false);
            const response = await getCategories(selectedMonth);
            setCategories(response.data);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        await deleteCategory(id);
        const response = await getCategories(selectedMonth);
        setCategories(response.data);
    };

    const handleCategoryClick = (category: any) => {
        setNewCategory({ category_name: category.category_name });
        setSelectedCategory(category);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewCategory({ category_name: '' });
        setSelectedCategory(null);
        setIsEditing(false);
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
                    {/* Parte izquierda: Crear categorías */}
                    <Box sx={{ width: '80%', padding: '10px', borderRight: '1px solid #ccc' }}>
                        <h3>{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h3>
                        <TextField
                            label="Nombre de la Categoría"
                            name="category_name"
                            value={newCategory.category_name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={isEditing ? handleUpdateCategory : handleCreateCategory}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
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

                    {/* Parte derecha: Ver categorías */}
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
                        {categories.map((c: any, index: number) => (
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
                                onClick={() => handleCategoryClick(c)}
                            >
                                <Delete
                                    sx={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evitar que el click en el icono active la edición
                                        handleDeleteCategory(c.id);
                                    }}
                                />
                                <p><strong>{c.category_name}</strong></p>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
