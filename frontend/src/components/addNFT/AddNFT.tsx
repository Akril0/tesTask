import React, {ChangeEvent, useState} from "react";
import Schedule from "../schedule/Schedule.tsx";
import styles from './AddNFT.module.css';
import RippleButton
    from "../buttons/rippleButton/RippleButton.tsx";
import Ripple
    from "../buttons/rippleButton/ripple/Ripple.tsx";
import {RxCross2} from "react-icons/rx";


const AddNFT = () => {
    const [nftName, setNftName] = useState("");
    const [priceHistory, setPriceHistory] = useState<Map<string, string>>(new Map());
    const [dateOfPrice, setDateOfPrice] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Обработчик отправки формы
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('nftName', nftName); // Добавление строки nftName

        // Сериализация и добавление priceHistory
        const serializedPriceHistory = JSON.stringify(chartData());
        formData.append('priceHistory', serializedPriceHistory);
        try {
            const response = await fetch('http://localhost:3000/api/nft', {
                method: 'POST',
                body: formData, // FormData отправляется на сервер
                // Заголовок 'Content-Type' не устанавливается явно
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

    const handleFileCancel =()=>{
        setFile(null);
        setPreviewUrl(null);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files ? event.target.files[0] : null;
        setFile(uploadedFile);
        if (uploadedFile) {
            const newPreviewUrl = URL.createObjectURL(uploadedFile);
            setPreviewUrl(newPreviewUrl);
        } else {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);  // Освобождаем ресурсы
                setPreviewUrl(null);
            }
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
                <h1>Coздать NFT</h1>
            </div>

            <div><Schedule data={chartData()}/></div>
            <form onSubmit={handleSubmit}
                  className={styles.form}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="nftName">Введите
                        название NFT</label>
                    <input type="text"
                           id="nftName"
                           name="nftName"
                           value={nftName}
                           onChange={(e) => setNftName(e.target.value)}/>
                </div>
                <div className={styles.inputWrapper}>
                    <label htmlFor="input__file">Выберите
                        файл</label>
                    <input className={styles.inputFile}
                           type="file" id="input__file"
                           name="natImg"
                           onChange={handleFileChange}
                           accept="image/*"/>
                    <label htmlFor="input__file"
                           className={styles.submitButton + " " + styles.fileButton}>
                        <div
                            className={styles.fileButtonContent}>Выбрать
                        </div>
                        <Ripple
                            color={"rgba(84,85,91,0.45)"}
                            duration={400}/>
                        <div style={{
                            maxHeight: file ? '300px' : "0px",
                        }} className={styles.filePreview}>
                            <button type="button" className={styles.cancelFile} onClick={handleFileCancel}>
                                <RxCross2 color={"red"}/>
                                <Ripple
                                    color={"rgba(84,85,91,0.45)"}
                                    duration={400}/>
                            </button>
                            <img src={previewUrl || "*"}
                                 alt="Preview"/>

                        </div>
                    </label>

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
                        Создать NFT
                    </RippleButton>
                </button>

            </form>
        </div>
    );
};

export default AddNFT;