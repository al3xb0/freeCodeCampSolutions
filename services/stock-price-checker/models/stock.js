import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  ipHashes: { type: [String], default: [] }
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
