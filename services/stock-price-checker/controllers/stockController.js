import axios from 'axios';
import Stock from '../models/stock.js';
import crypto from 'crypto';

function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip + process.env.IP_HASH_SALT).digest('hex');
}

async function getStockInfo(symbol) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
  const res = await axios.get(url);
  if (!res?.data?.symbol) throw new Error('Stock not found');
  return { symbol: res.data.symbol, price: res.data.latestPrice };
}

export async function getStockPrice(req, res) {
  try {
    let { stock, like } = req.query;
    like = like === 'true' || like === 'on' || like === '1';

    if (!stock) return res.status(400).json({ error: 'Missing stock symbol' });
    const stocks = Array.isArray(stock) ? stock : [stock];
    if (stocks.length > 2) return res.status(400).json({ error: 'Only one or two stocks supported' });

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection.remoteAddress || '';
    const ipHash = anonymizeIP(ip);

    const dataPromises = stocks.map(async (symbolRaw) => {
      const symbol = symbolRaw.toUpperCase();
      const info = await getStockInfo(symbol);
      let record = await Stock.findOne({ symbol });
      let likes = 0;
      if (!record) {
        record = new Stock({ symbol, likes: 0, ipHashes: [] });
      }
      if (like && !record.ipHashes.includes(ipHash)) {
        record.likes++;
        record.ipHashes.push(ipHash);
        await record.save();
      } else if (!like && record._id) {
        likes = record.likes;
      } else if (record._id) {
        likes = record.likes;
      } else {
        await record.save();
      }
      return { stock: info.symbol, price: info.price, likes: record.likes };
    });
    const stockResponse = await Promise.all(dataPromises);
    if (stockResponse.length === 1) {
      res.json({ stockData: stockResponse[0] });
    } else {
      const relLikes1 = stockResponse[0].likes - stockResponse[1].likes;
      const relLikes2 = stockResponse[1].likes - stockResponse[0].likes;
      res.json({
        stockData: [
          { stock: stockResponse[0].stock, price: stockResponse[0].price, rel_likes: relLikes1 },
          { stock: stockResponse[1].stock, price: stockResponse[1].price, rel_likes: relLikes2 }
        ]
      });
    }
  } catch (err) {
    res.status(400).json({ error: 'Stock not found or service unavailable' });
  }
}
