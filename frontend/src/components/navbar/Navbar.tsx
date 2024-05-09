import {NavLink} from "react-router-dom";
import RippleButton from "../buttons/rippleButton/RippleButton";


const Navbar = () => {
    return (
        <div>
            <div>
                <NavLink to="/add">
                    <RippleButton>
                        List
                    </RippleButton>
                </NavLink>
                <NavLink to="/add">
                    <RippleButton>
                        Add
                    </RippleButton>
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;