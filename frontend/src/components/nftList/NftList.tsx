import {useEffect, useState} from "react";
import NftCard from "../nftCard/NftCard.tsx";
import styles from './NftList.module.css';

interface INftItem {
    id: string;
    name: string;
    image_path: string;
    lastPrice: string;
}

const NftList = () => {
    const [nftList, setNftList] = useState<INftItem[]>([]);

    useEffect(() => {
        (async function () {
            const res = await getlist();
            setNftList(res);
        })();
    }, []);

    const getlist = async () => {
        return await fetch('http://localhost:3000/api/nft')
            .then(res => res.json())
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error); // Обрабатываем возможные ошибки
            });
    };

    const deleteHandler = async (id: string) => {
        await fetch(`http://localhost:3000/api/nft/${id}`, {
            method: 'DELETE',
        })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error); // Обрабатываем возможные ошибки
            });
        setNftList(prevState => prevState.filter(el => el.id !== id));
    };
    return (
        <div className={styles.nftList}>
            {nftList && nftList.map((item) => (
                <div key={item.id}>
                    <NftCard {...item}
                             deleteHandler={deleteHandler}/>
                </div>
            ))}
        </div>
    );
};

export default NftList;
