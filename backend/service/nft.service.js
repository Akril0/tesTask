const db = require('../db.js')
const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

class NftService {
    async createNft(req, res){
        const { nftName } = req.body;
        const priceHistory = JSON.parse(req.body.priceHistory);
        const imagePath = req.file.path; // Путь к сохраненному файлу изображения

        try {
            const insertText = 'INSERT INTO nfts(name, image_path) VALUES($1, $2) RETURNING id';
            const response = await db.query(insertText, [nftName, imagePath]);
            const nftId = response.rows[0].id;
            for (const el of priceHistory) {
                const priceInsertText = 'INSERT INTO price_history(nft_id, date, price) VALUES($1, $2, $3)';
                await db.query(priceInsertText, [nftId, el.date, el.price]);
            }
            res.send('NFT and price history saved successfully');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving data');
        }
    }
    async getNftList(req, res){
        try {
            const fetchText = `
            SELECT DISTINCT ON (n.id) n.id, n.name, n.image_path, p.price
            FROM nfts n
            LEFT JOIN price_history p ON n.id = p.nft_id
            ORDER BY n.id, p.date DESC;`;
            const response = await db.query(fetchText);
            const nfts = response.rows.map(nft => ({
                id: nft.id,
                name: nft.name,
                image_path: nft.image_path,
                lastPrice: nft.price
            }));

            res.json(nfts);
        } catch (err) {
            console.error('Failed to retrieve NFTs:', err);
            res.status(500).send('Error retrieving data');
        }
    }
    async getNft(req, res){
        const nftId = req.params.id; // Получаем ID из URL

        try {
            // Обновленный SQL-запрос для получения данных NFT вместе с историей цен
            const queryText = `
            SELECT n.*, ph.date::text as price_date, ph.price
            FROM nfts n
            LEFT JOIN price_history ph ON n.id = ph.nft_id
            WHERE n.id = $1
            ORDER BY ph.date DESC;`;

            const result = await db.query(queryText, [nftId]);

            if (result.rows.length > 0) {
                // Структурирование данных для клиента
                const nftData = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    image_path: result.rows[0].image_path,
                    priceHistory: result.rows.map(row =>  ({
                        date: row.price_date,
                        price: row.price,
                    }))
                };
                res.json(nftData); // Отправка структурированных данных NFT клиенту
            } else {
                res.status(404).send('NFT not found'); // Ошибка, если NFT не найден
            }
        } catch (err) {
            console.error('Error retrieving NFT:', err);
            res.status(500).send('Server error');
        }
    }
    async updateNft(req, res){
        const nftId = req.params.id;
        const prices = JSON.parse(req.body.priceHistory); // Предполагается, что это массив
        try {
            // Очистка существующих записей для этого NFT
            await db.query('DELETE FROM price_history WHERE nft_id = $1', [nftId]);

            // Подготовка и выполнение запросов для каждой записи в массиве
            for (const el of prices) {
                const priceInsertText = 'INSERT INTO price_history(nft_id, date, price) VALUES($1, $2, $3)';
                await db.query(priceInsertText, [nftId, el.date, el.price]);
            }

            res.send('Price history updated successfully for NFT with ID ' + nftId);
        } catch (err) {
            console.error('Error updating NFT price history:', err);
            res.status(500).send('Error updating data');
        }
    }
    async deleteNft(req, res){
        const nftId = req.params.id; // Получаем ID NFT из параметров маршрута

        try {
            // Получение пути изображения из базы данных
            const selectImagePath = 'SELECT image_path FROM nfts WHERE id = $1';
            const result = await db.query(selectImagePath, [nftId]);
            if (result.rows.length > 0) {
                const imagePath = result.rows[0].image_path;

                // Удаление из price_history
                const deletePriceHistory = 'DELETE FROM price_history WHERE nft_id = $1';
                await db.query(deletePriceHistory, [nftId]);

                // Удаление NFT
                const deleteNftQuery = 'DELETE FROM nfts WHERE id = $1';
                await db.query(deleteNftQuery, [nftId]);

                // Удаление файла изображения
                await unlinkAsync(imagePath);
                res.send('NFT and associated image deleted successfully');
            } else {
                throw new Error('NFT not found');
            }
        } catch (err) {
            console.error('Failed to delete NFT:', err);
            res.status(500).send('Error deleting NFT');
        }
    }
}

module.exports = new NftService();