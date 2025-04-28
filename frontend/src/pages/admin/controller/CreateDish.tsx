import { Grid, Box, useTheme, TextField, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import {
    createDish, getDishes, getIngredients, getCategories,
    deleteDish, updateDish
} from '@/controller';

export const CreateDish = () => {
    const theme = useTheme();
    const [dishes, setDishes] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [newDish, setNewDish] = useState<{ dish_name: string; ingredients: number[]; category: number | null; hasSideDishes: boolean, price: number, time_elaboration: string, description: string, link_ar: string }>({ dish_name: '', ingredients: [], category: null, hasSideDishes: false, price: 0, time_elaboration: '', description: '', link_ar: '' });
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedDish, setSelectedDish] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIngredients = ingredients.filter((ing) =>
        ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const fetchDishes = async () => {
            const dishList = await getDishes();
            setDishes(dishList);
        };
        fetchDishes();
    }, []);

    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await getIngredients();
            setIngredients(response || []);
        };
        fetchIngredients();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            setCategories(response || []);
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDish({ ...newDish, [name]: value });
    };

    const handleIngredientChange = (id: number) => {
        setNewDish((prev) => {
            const ingredients = prev.ingredients.includes(id)
                ? prev.ingredients.filter((ingredientId) => ingredientId !== id)
                : [...prev.ingredients, id];
            return { ...prev, ingredients };
        });
    };

    const handleCreateDish = async () => {
        if (!newDish.dish_name || !newDish.category) {
            alert('Debe ingresar un nombre y seleccionar una categoría.');
            return;
        }
        await createDish(newDish);
        setNewDish({ dish_name: '', ingredients: [], category: null, hasSideDishes: false, price: 0, time_elaboration: '', description: '', link_ar: '' });
        const response = await getDishes();
        setDishes(response);
    };

    const handleUpdateDish = async () => {
        if (!newDish.dish_name || !newDish.category) {
            alert('Debe ingresar un nombre y seleccionar una categoría.');
            return;
        }
        const data = {
            id: selectedDish.id,
            dish_name: newDish.dish_name, // Asegurar que se envíe como dish_name
            ingredients: newDish.ingredients,
            category: newDish.category,
            has_garrison: newDish.hasSideDishes, // Cambiar a has_garrison para coincidir con el backend
            price: newDish.price,
            time_elaboration: newDish.time_elaboration,
            description: newDish.description,
            link_ar: newDish.link_ar
        };
        await updateDish(data);
        setNewDish({ dish_name: '', ingredients: [], category: null, hasSideDishes: false, price: 0, time_elaboration: '', description: '', link_ar: '' });
        setSelectedDish(null);
        setIsEditing(false);
        const response = await getDishes();
        setDishes(response || []);
    };

    const handleDeleteDish = async (id: number) => {
        await deleteDish(id);
        const response = await getDishes();
        setDishes(response || []);
    };

    const handleDishClick = (dish: any) => {
        setNewDish({
            dish_name: dish.dish_name,
            ingredients: dish.ingredient || [],
            category: dish.category || null,
            hasSideDishes: dish.has_garrison || false,
            price: dish.price || 0,
            time_elaboration: dish.time_elaboration || '',
            description: dish.description || '',
            link_ar: dish.link_ar || ''
        });
        setSelectedDish(dish);
        setIsEditing(true); // Activar modo edición
    };

    const handleCancelEdit = () => {
        setNewDish({ dish_name: '', ingredients: [], category: null, hasSideDishes: false, price: 0, time_elaboration: '', description: '', link_ar: '' });
        setSelectedDish(null);
        setIsEditing(false);
    };

    const handleCategoryChange = (categoryId: number) => {
        setNewDish({ ...newDish, category: categoryId });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: theme.background.primary,
            }}
        >
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Crear plato */}
                    <Box sx={{
                        width: '70%', padding: '10px', borderRight: '1px solid #ccc',
                        maxHeight: '95vh', overflowY: 'auto'
                    }}>
                        <h3>{selectedDish ? 'Editar Plato' : 'Crear Plato'}</h3>
                        <TextField
                            label="Nombre del Plato"
                            name="dish_name" // Cambiar el nombre del campo a 'dish_name'
                            value={newDish.dish_name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            variant="outlined" // Asegurar que el variant sea 'outlined'
                        />
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr', // Crear un grid de 2 columnas
                                gap: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField
                                label="Precio del Plato"
                                name="price"
                                type="number"
                                value={newDish.price}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Tiempo de Elaboración"
                                name="time_elaboration"
                                type="text"
                                value={newDish.time_elaboration}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                        <TextField
                            label="Descripción"
                            name="description"
                            value={newDish.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3} // Limitar a un máximo de 2 filas
                        />
                        <TextField
                            label="Link AR"
                            name="link_ar"
                            value={newDish.link_ar}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <h4>Ingredientes</h4>
                        <TextField
                            label="Buscar Ingrediente"
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                            {filteredIngredients.map((ingredient) => (
                                <FormControlLabel
                                    key={ingredient.id}
                                    control={
                                        <Checkbox
                                            checked={newDish.ingredients.includes(ingredient.id)}
                                            onChange={() => handleIngredientChange(ingredient.id)}
                                        />
                                    }
                                    label={ingredient.ingredient_name}
                                />
                            ))}
                        </FormGroup>
                        <h4>Categoría</h4>
                        <FormGroup
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr', // 1 columna en pantallas pequeñas
                                    sm: 'repeat(4, 1fr)', // 4 columnas en pantallas más grandes
                                },
                                gap: '10px',
                            }}
                        >
                            {categories.map((category) => (
                                <FormControlLabel
                                    key={category.id}
                                    control={
                                        <Radio
                                            checked={newDish.category === category.id} // Verificar si la categoría está seleccionada
                                            onChange={() => handleCategoryChange(category.id)} // Cambiar la categoría seleccionada
                                        />
                                    }
                                    label={category.category_name}
                                />
                            ))}
                        </FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newDish.hasSideDishes}
                                    onChange={(e) => setNewDish({ ...newDish, hasSideDishes: e.target.checked })}
                                />
                            }
                            label="Tiene guarniciones"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={selectedDish ? handleUpdateDish : handleCreateDish}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        >
                            {selectedDish ? 'Actualizar Plato' : 'Crear Plato'}
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

                    {/* Parte derecha: Ver platos */}
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
                        {dishes && dishes.length > 0 ? (
                            dishes.map((dish, index) => (
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
                                    onClick={() => handleDishClick(dish)}
                                >
                                    <p><strong>{dish.dish_name}</strong></p>
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
                                            handleDeleteDish(dish.id);
                                        }}
                                    />
                                </Box>
                            ))
                        ) : (
                            <p>No hay platos disponibles.</p>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
