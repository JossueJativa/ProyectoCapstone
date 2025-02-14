import { OrangeButton } from '../../../components';
import { AddDesk } from './AddDesk';
import { AddAllergen } from './AddAllergen';
import { AddIngredients } from './AddIngredients';

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
