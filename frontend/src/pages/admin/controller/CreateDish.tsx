import { Grid, Box, useTheme, TextField, Button, Checkbox, FormControlLabel, FormGroup, Radio } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import {
    createDish, getDishes, getIngredients, getCategories,
    deleteDish, updateDish
} from '@/controller';
import { IDishData } from '@/interfaces';

export const CreateDish = () => {
    const theme = useTheme();
    const [dishes, setDishes] = useState<any[]>([]);
    const [newDish, setNewDish] = useState<{ name: string; description: string; time_elaboration: number; price: number; link_ar: string; ingredients: string[]; category: number | null; has_garrison: boolean }>({ name: '', description: '', time_elaboration: 0, price: 0, link_ar: '', ingredients: [], category: null, has_garrison: false });
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedDish, setSelectedDish] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [dishSearchTerm, setDishSearchTerm] = useState('');
    const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');

    const handleDishSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDishSearchTerm(e.target.value);
    };

    const handleIngredientSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIngredientSearchTerm(e.target.value);
    };

    const filteredDishes = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(dishSearchTerm.toLowerCase())
    );

    const filteredIngredients = ingredients.filter((ing) =>
        ing.ingredient_name.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
    );

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

    const handleIngredientChange = (id: string) => {
        setNewDish((prev) => {
            const ingredients = prev.ingredients.includes(id)
                ? prev.ingredients.filter((ingredientId) => ingredientId !== id)
                : [...prev.ingredients, id];
            return { ...prev, ingredients };
        });
    };

    const handleCreateDish = async () => {
        if (!newDish.name || !newDish.category) {
            alert('Debe ingresar un nombre y seleccionar una categoría.');
            return;
        }
        const data: IDishData = {
            dish_name: newDish.name,
            description: newDish.description,
            time_elaboration: newDish.time_elaboration,
            price: Number(newDish.price),
            link_ar: newDish.link_ar,
            ingredients: newDish.ingredients,
            category: newDish.category,
            has_garrison: newDish.has_garrison,
            id: 0
        };
        await createDish(data);
        const response = await getDishes();
        if (response.length > 0) {
            setNewDish({ name: '', description: '', time_elaboration: 0, price: 0, link_ar: '', ingredients: [], category: null, has_garrison: false });
        }
        setDishes(response);
    };

    const handleUpdateDish = async () => {
        if (!newDish.name || !newDish.category) {
            alert('Debe ingresar un nombre y seleccionar una categoría.');
            return;
        }
        const data = {
            id: selectedDish.id,
            dish_name: newDish.name, // necesario para updateDish
            name: newDish.name,
            description: newDish.description,
            time_elaboration: Number(newDish.time_elaboration),
            price: Number(newDish.price),
            link_ar: newDish.link_ar,
            ingredients: newDish.ingredients,
            category: newDish.category,
            has_garrison: newDish.has_garrison
        };
        await updateDish(data);
        setNewDish({ name: '', description: '', time_elaboration: 0, price: 0, link_ar: '', ingredients: [], category: null, has_garrison: false });
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
            name: dish.dish_name,
            description: dish.description,
            time_elaboration: dish.time_elaboration,
            price: dish.price,
            link_ar: dish.link_ar,
            ingredients: dish.ingredient || [], // Usar dish.ingredient para autoselección
            category: dish.category || null,
            has_garrison: dish.has_garrison || false
        });
        setSelectedDish(dish);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewDish({ name: '', description: '', time_elaboration: 0, price: 0, link_ar: '', ingredients: [], category: null, has_garrison: false });
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
                    <SideBar onMonthChange={() => { }} />
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
                            name="name"
                            value={newDish.name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
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
                            rows={3}
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
                            value={ingredientSearchTerm}
                            onChange={handleIngredientSearchChange}
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
                                    checked={newDish.has_garrison}
                                    onChange={(e) => setNewDish({ ...newDish, has_garrison: e.target.checked })}
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
                        <TextField
                            label="Buscar Plato"
                            value={dishSearchTerm}
                            onChange={handleDishSearchChange}
                            fullWidth
                            margin="normal"
                            sx={{ marginBottom: '10px' }}
                        />
                        {filteredDishes && filteredDishes.length > 0 ? (
                            filteredDishes.map((dish, index) => (
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
                                    <p><strong>{dish.name}</strong></p>
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
