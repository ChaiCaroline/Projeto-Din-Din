import Signin from './pages/Login/signin/index';
import Main from './pages/home/index';
import SignUp from './pages/Login/SignUp/index';
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getItem } from './utils/storage';

function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token');
    const isAuthenticated = token;

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route element={<ProtectedRoutes redirectTo='/' />}>
                <Route path="/main" element={<Main />} />
            </Route>
        </Routes>


    );
}

export default MainRoutes;