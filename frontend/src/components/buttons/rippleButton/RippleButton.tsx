import React from "react";
import styles from './RippleButton.module.css';
import Ripple from "./ripple/Ripple";

type RippleButtonProps = {
    type?: "submit" | "reset" | "button"
    className?:string,
    children: React.ReactNode,

}

const RippleButton: React.FC<RippleButtonProps> = ({children, type, className}) => {
    return <button type={type} className={styles.styledButton + " " + (className || "")}>
        {children}
        <Ripple color={"rgba(84,85,91,0.45)"} duration={400}/>
     </button>;
};

export default RippleButton;
