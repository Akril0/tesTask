import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/mainLayout/MainLayout";

const Routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>

                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Routes;