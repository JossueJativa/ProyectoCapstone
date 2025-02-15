import { useEffect, useState } from 'react';

import { createIngredient, getAllergens } from '../../../controller';
import { InputText, SelectList, TransparentButton } from '../../../components';

export const AddIngredients = () => {
    const [data, setData] = useState({
        name: '',
        quantity: '',
        allergens: []
    });
    const [listAllergens, setListAllergens] = useState([]);

    useEffect(() => {
        const fetchAllergens = async () => {
            try {
                const response = await getAllergens();
                setListAllergens(response);
            } catch (error) {
                console.error("Error al obtener alérgenos:", error);
            }
        };
        fetchAllergens();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'allergens') {
            setData(prevData => ({
                ...prevData,
                allergens: checked 
                    ? [...prevData.allergens, Number(value)]  // Guardar como número
                    : prevData.allergens.filter(id => id !== Number(value))
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createIngredient(data);
            console.log("Ingrediente creado:", response);
            setData({ name: '', quantity: '', allergens: [] });
        } catch (error) {
            console.error("Error al crear ingrediente:", error);
        }
    };

    return (
        <>
            <p>Agregar un ingrediente</p>
            <br />
            <InputText
                label="Nombre"
                name="name"
                value={data.name}
                onChange={handleChange}
                isRequired={true}
            />
            <InputText
                label="Cantidad"
                name="quantity"
                value={data.quantity}
                onChange={handleChange}
                isRequired={true}
                isNumber={true}
            />
            <label>Alérgenos</label>
            <br />
            {listAllergens.length > 0 ? (
                <SelectList 
                    list={listAllergens} 
                    name="allergens" 
                    checked={data.allergens} 
                    onChange={handleChange} 
                    labelKey="allergen_name" 
                />            
            ) : (
                <p>Cargando alérgenos...</p>
            )}
            <TransparentButton text="Agregar" onClick={handleSubmit} />
        </>
    );
};
