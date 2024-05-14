import React from "react";
import styles from './NftCard.module.css';
import {FaTrashCan} from "react-icons/fa6";
import RippleButton
    from "../buttons/rippleButton/RippleButton.tsx";
import {Link} from "react-router-dom";

interface NftCardProps {
    id: string;
    name: string;
    image_path: string;
    lastPrice: string;
    deleteHandler: (id: string) => void;
}

const NftCard: React.FC<NftCardProps> = ({
                                             id,
                                             name,
                                             image_path,
                                             lastPrice,
                                             deleteHandler,
                                         }) => {


    return (
        <div className={styles.nftCardWrapper}>
            <div className={styles.deleteButton}
                 onClick={() => deleteHandler(id)}>
                <RippleButton>
                    <FaTrashCan color="red"/>
                </RippleButton>
            </div>
            <Link to={`/${id}`} className={styles.nftCard}>

                <div className={styles.nftImage}>
                    <img
                        src={`http://localhost:3000/${image_path}`}
                        alt={name}/>
                </div>
                <div className={styles.nftName}>{name}</div>
                <div
                    className={styles.nftPrice}>{lastPrice}</div>
            </Link>
        </div>
    );
};

export default NftCard;
