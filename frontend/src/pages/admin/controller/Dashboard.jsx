import { OrangeButton } from '../../../components';
import { AddDesk } from './AddDesk';

export const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <br />
            <AddDesk />
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
