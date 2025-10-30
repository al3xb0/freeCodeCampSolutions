import express from 'express';
import { getStockPrice } from '../controllers/stockController.js';

const router = express.Router();

router.get('/stock-prices', getStockPrice);

export default router;
