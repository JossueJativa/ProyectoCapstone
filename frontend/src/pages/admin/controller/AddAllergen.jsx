import { useState } from 'react';

import { createAllergen } from '../../../controller';
import { InputText, TransparentButton } from '../../../components';


export const AddAllergen = () => {
    const [data, setData] = useState({
        name: ''
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await createAllergen(data);
        console.log(response);
        setData({
            name: ''
        });
    }

    return (
        <>
            <p>Agregar un alérgeno</p>
            <br />
            <InputText
                label="Nombre del alérgeno"
                name="name"
                value={data.name}
                onChange={handleChange}
                isRequired={true}
            />
            <TransparentButton
                text={"Agregar"}
                onClick={handleSubmit}
            />
        </>
    )
}
