import { useState } from 'react';
import { InputText, OrangeButton } from '../../../components';
import { LoginAuth } from '../../../controller';

export const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const { email, password } = data;
        const response = await LoginAuth(email, password);
        if (response) {
            window.location.href = '/admin/home';
        } else {
            alert('Usuario o contraseña incorrecta');
        }
    }

    return (
        <>
            <h1>Login</h1>
            <br />
            <InputText
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                isRequired={true}
            />
            <InputText
                label="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                isPassword={true}
                isRequired={true}
            />
            <OrangeButton
                text={"Login"}
                onClick={handleSubmit}
            />
        </>
    )
}
