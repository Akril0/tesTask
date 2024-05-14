import Navbar from "../../components/navbar/Navbar";
import {Outlet} from "react-router-dom";
import styles from './MainLayout.module.css'
const MainLayout = () => {
    return (
        <div className={styles.mainlayout}>
            <div className={styles.navbar}>
                <Navbar/>
            </div>
            <div className={styles.content}>
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;