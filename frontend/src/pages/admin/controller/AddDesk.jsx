import { useState } from 'react';

import { createDesk } from '../../../controller';
import { InputText, TransparentButton } from '../../../components';

export const AddDesk = () => {
    const [data, setData] = useState({
        number: '',
        capacity: ''
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await createDesk(data);
        console.log(response);
        setData({
            number: '',
            capacity: ''
        });
    }
    return (
        <>
            <p>Agregar una mesa</p>
            <br />
            <InputText
                label="Número de Mesa"
                name="number"
                value={data.number}
                onChange={handleChange}
                isRequired={true}
                isNumber={true}
            />
            <InputText
                label="Capacidad"
                name="capacity"
                value={data.capacity}
                onChange={handleChange}
                isRequired={true}
                isNumber={true}
            />
            <TransparentButton
                text={"Agregar"}
                onClick={handleSubmit}
            />
        </>
    )
}
