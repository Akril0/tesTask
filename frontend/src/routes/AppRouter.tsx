import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/mainLayout/MainLayout";
import AddNFT from "../components/addNFT/AddNFT.tsx";
import NftList from "../components/nftList/NftList.tsx";
import EditNft from "../components/editNft/EditNft.tsx";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<NftList/>}/>
                    <Route path='add' element={<AddNFT/>}/>
                    <Route path=':id' element={<EditNft/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;