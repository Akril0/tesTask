import {NavLink} from "react-router-dom";
import RippleButton
    from "../buttons/rippleButton/RippleButton";
import styles from './Navbar.module.css';


const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <NavLink to="/"
                     className={({isActive}) => styles.navlink + " " + (isActive ?  styles.activeNavlink : "")}>
                <RippleButton>
                    List
                </RippleButton>
            </NavLink>
            <NavLink to="/add"
                     className={({isActive}) => styles.navlink + " " + (isActive ? styles.activeNavlink :  "")}>
                <RippleButton>
                    Add
                </RippleButton>
            </NavLink>
        </div>
    );
};

export default Navbar;