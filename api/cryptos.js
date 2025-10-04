// api/cryptos.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CMC_API_KEY = process.env.CMC_API_KEY;

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

app.get("/api/cryptos", async (req, res) => {
  try {
    // Traemos las criptomonedas más recientes desde CoinMarketCap (limit ajustable)
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=200&convert=USD";

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
    });

    if (!response.ok) throw new Error("Error al conectar con CoinMarketCap");

    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      throw new Error("No se encontraron criptomonedas");
    }

    // Ordenar por cmc_rank
    const sortedCoins = data.data.sort((a, b) => a.cmc_rank - b.cmc_rank);

    // Mapear resultados para enviar al front
    const results = sortedCoins.map((coin) => ({
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      slug: coin.slug,
      cmc_url: `https://coinmarketcap.com/currencies/${coin.slug}/`,
      circulating_supply: coin.circulating_supply,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      last_updated: coin.last_updated,
      quote: coin.quote
        ? {
            USD: {
              price: coin.quote.USD.price,
              volume_24h: coin.quote.USD.volume_24h,
              market_cap: coin.quote.USD.market_cap,
              percent_change_24h: coin.quote.USD.percent_change_24h,
            },
          }
        : null,
    }));

    res.json(results);
  } catch (error) {
    console.error("Error al obtener criptomonedas:", error.message);
    res.status(500).json({ error: "Error al obtener datos de CoinMarketCap" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
