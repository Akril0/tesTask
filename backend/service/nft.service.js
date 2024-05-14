const db = require('../db.js')

class NftService {
    async createNft(req, res){
        const { nftName } = req.body;
        const priceHistory = JSON.parse(req.body.priceHistory);
        const imagePath = req.file.path; // Путь к сохраненному файлу изображения

        try {
            const insertText = 'INSERT INTO nfts(name, image_path) VALUES($1, $2) RETURNING id';
            const response = await db.query(insertText, [nftName, imagePath]);
            const nftId = response.rows[0].id;

            for (const [date, price] of priceHistory) {
                const priceInsertText = 'INSERT INTO price_history(nft_id, date, price) VALUES($1, $2, $3)';
                await client.query(priceInsertText, [nftId, date, price]);
            }
            res.send('NFT and price history saved successfully');
        } catch (err) {
            await client.query('ROLLBACK');
            client.release();
            console.error(err);
            res.status(500).send('Error saving data');
        }
    }
    async getNftList(req, res){

    }
    async getNft(req, res){

    }
    async updateNft(req, res){

    }
    async deleteNft(req, res){

    }
}

module.exports = new NftService();