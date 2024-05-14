require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nftController = require('./controller/nft.controller.js');
const cors = require('cors');
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Разрешить запросы только от этого домена
    optionsSuccessStatus: 200 // некоторые устаревшие браузеры (IE11, разные SmartTV) требуют этого
};


const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', nftController);
app.use('/uploads', express.static('./uploads'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
