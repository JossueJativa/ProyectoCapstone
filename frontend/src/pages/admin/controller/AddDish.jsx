import { useEffect, useState } from 'react';

import { createDish, getIngredients } from '../../../controller';
import { InputText, TransparentButton, TextArea, SelectList, TimeInput } from '../../../components';

export const AddDish = () => {
    const [data, setData] = useState({
        name: '',
        description: '',
        time_elaboration: '',
        price: '',
        link_ar: '',
        ingredients: []
    });
    const [listIngredients, setListIngredients] = useState([]);

    useEffect(() => {
        const fetchIngredients = async() => {
            try {
                const response = await getIngredients();
                setListIngredients(response);
            } catch (error) {
                console.error("Error al obtener ingredientes:", error);
            }
        };
        fetchIngredients();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'ingredients') {
            setData(prevData => ({
                ...prevData,
                ingredients: checked 
                    ? [...prevData.ingredients, Number(value)]
                    : prevData.ingredients.filter(id => id !== Number(value))
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
            const response = await createDish(data);
            console.log("Plato creado:", response);
            setData({ 
                name: '', 
                description: '', 
                time_elaboration: '', 
                price: '', 
                link_ar: '', 
                ingredients: [] 
            });
        } catch (error) {
            console.error("Error al crear plato:", error);
        }
    };

    const setTime = (e) => {
        setData(prevData => ({
            ...prevData,
            time_elaboration: e.target.value
        }));
    };    

    return (
        <>
            <p>Agregar un nuevo plato</p>
            <br />
            <InputText
                label="Nombre"
                name="name"
                value={data.name}
                onChange={handleChange}
                isRequired={true}
            />
            <TextArea
                label="Descripción"
                name="description"
                value={data.description}
                onChange={handleChange}
                isRequired={true}
            />
            <TimeInput
                label='Tiempo de elaboración'
                name='time_elaboration'
                value={data.time_elaboration}
                onChange={setTime}
                isRequired={true}
            />
            <InputText
                label="Precio"
                name="price"
                value={data.price}
                isNumber={true}
                onChange={handleChange}
                isRequired={true}
            />
            <InputText
                label="Link a la imagen AR"
                name="link_ar"
                value={data.link_ar}
                onChange={handleChange}
                isRequired={true}
            />
            <br />
            <p>Ingredientes</p>
            <SelectList
                name="ingredients"
                list={listIngredients}
                checked={data.ingredients}
                onChange={handleChange}
                labelKey="ingredient_name"
            />
            <TransparentButton
                text={"Agregar"}
                onClick={handleSubmit}
            />
        </>
    )
}
