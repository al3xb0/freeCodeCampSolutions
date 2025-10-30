import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 3000, () => console.log('Server running'));
}

export default app;
