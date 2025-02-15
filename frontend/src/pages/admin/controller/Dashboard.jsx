import { OrangeButton } from '../../../components';
import { AddDesk } from './AddDesk';
import { AddAllergen } from './AddAllergen';
import { AddIngredients } from './AddIngredients';
import { AddDish } from './AddDish';

export const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <br />
            <AddDesk />
            <br />
            <AddAllergen />
            <br />
            <AddIngredients />
            <br />
            <AddDish />
            <OrangeButton
                text={"Logout"}
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/admin';
                }}
            />
        </>
    )
}