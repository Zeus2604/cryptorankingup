// api/cryptos.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const CMC_API_KEY = process.env.CMC_API_KEY;

app.use(express.static("public"));

app.get("/api/cryptos", async (req, res) => {
  try {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=200&convert=USD";
    const response = await fetch(url, { headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY } });
    if (!response.ok) throw new Error("Error al conectar con CoinMarketCap");
    const data = await response.json();
    if (!data?.data?.length) throw new Error("No se encontraron criptomonedas");

    const sortedCoins = data.data.sort((a,b)=>a.cmc_rank-b.cmc_rank);
    const results = sortedCoins.map(c => ({
      name: c.name,
      symbol: c.symbol,
      cmc_rank: c.cmc_rank,
      slug: c.slug,
      cmc_url: `https://coinmarketcap.com/currencies/${c.slug}/`,
      circulating_supply: c.circulating_supply,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${c.id}.png`,
      last_updated: c.last_updated,
      quote: c.quote?.USD ? {
        USD: {
          price: c.quote.USD.price,
          volume_24h: c.quote.USD.volume_24h,
          market_cap: c.quote.USD.market_cap,
          percent_change_24h: c.quote.USD.percent_change_24h
        }
      } : null
    }));

    res.json(results);
  } catch(e) {
    console.error("Error al obtener criptomonedas:", e.message);
    res.status(500).json({ error: "Error al obtener datos de CoinMarketCap" });
  }
});

app.listen(PORT, ()=>console.log(`Servidor corriendo en http://localhost:${PORT}`));
