import {Outlet, Navigate} from "react-router-dom";

const RedirectToProducts = () => {

    const token = localStorage.getItem('jwt');

    return token ? <Navigate to="/products"/> : <Outlet/>
}

export default RedirectToProducts