import express from 'express';
import { convert } from '../controllers/convertHandler.js';

const router = express.Router();

router.get('/convert', convert);

export default router;
