import React, {
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import {useParams} from "react-router-dom";
import styles from "./EditNft.module.css";
import Schedule from "../schedule/Schedule.tsx";
import RippleButton
    from "../buttons/rippleButton/RippleButton.tsx";

interface Nft {
    id: string,
    name: string,
    image_path: string,
    priceHistory: Map<string, number>,
}

interface NftResponce {
    id: string,
    name: string,
    image_path: string,
    priceHistory:PriceHistory[],
}

interface PriceHistory {
    date: string,
    price: string
}

const EditNft = () => {
    const params = useParams();
    const id = params.id;
    const [nft, setNft] = useState<Nft>();
    const [priceHistory, setPriceHistory] = useState<Map<string, string>>(new Map());
    const [dateOfPrice, setDateOfPrice] = useState("");
    const [price, setPrice] = useState("");
    useEffect(() => {
        (async function () {
            const res = await fetch(`http://localhost:3000/api/nft/${id}`)
                .then(res => res.json());
            setNft({
                id:res.id,
                name: res.name,
                image_path: res.image_path,
                priceHistory: convertArrayToMap(res.priceHistory),
            });
            setDefault(res);
        })();

    }, []);

    function convertArrayToMap(array: PriceHistory[]) {
        const map = new Map();
        array.forEach(item => {
            map.set(item.date, parseFloat(item.price));
        });
        return map;
    }
    const setDefault= (nft: NftResponce)=>{
        setPriceHistory(convertArrayToMap(nft.priceHistory));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        const serializedPriceHistory = JSON.stringify(chartData());
        formData.append('priceHistory', serializedPriceHistory);
        console.log(formData);
        try {
            const response = await fetch(`http://localhost:3000/api/nft/${nft?.id}`, {
                method: 'PUT',
                body: formData, // FormData отправляется на сервер
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                console.log(response);
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading file');
        }
    };

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDateOfPrice(event.target.value);
        const date = priceHistory.get(event.target.value);
        if (date) {
            setPrice(date);
        } else {
            setPrice("");
        }
    };

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    };

    const handlePriceHistoryChange = () => {
        if (dateOfPrice !== "" && price !== "") {
            setPriceHistory(prevState => {
                const newMap = new Map(prevState);
                newMap.set(dateOfPrice, price);
                return newMap;
            });
        }
    };

    const chartData = () => Array.from(priceHistory.entries()).map(([date, price]) => ({
        date,
        price,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className={styles.addNft}>
            <div className={styles.title}>
                <h1>Редактировать NFT</h1>
            </div>

            <div><Schedule data={chartData()}/></div>
            <form onSubmit={handleSubmit}
                  className={styles.form}>
                <div className={styles.nftCard}>
                    <img src={"http://localhost:3000/" + nft?.image_path} alt={nft?.name}/>
                    {nft?.name}
                </div>
                <div className={styles.inputWrapper}>
                    <label htmlFor="dateOfPrice">Введите историю цен</label>
                    <div
                        className={styles.inputPriceHistory}>

                        <input
                            type="date"
                            id="dateOfPrice"
                            name="dateOfPrice"
                            value={dateOfPrice}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={handleDateChange} // Обработчик изменения инпута
                        />
                        <input type="number"
                               id="price"
                               name="price"
                               value={price}
                               min={0}
                               onChange={handlePriceChange}/>
                    </div>
                    <button type="button"
                            className={styles.submitButton}
                            onClick={handlePriceHistoryChange}>
                        <RippleButton type="button">
                            Добавить
                        </RippleButton>
                    </button>
                </div>
                <button type="submit"
                        className={styles.submitButton}>
                    <RippleButton>
                        Реавткировать NFT
                    </RippleButton>
                </button>

            </form>
        </div>
    );
};

export default EditNft;
