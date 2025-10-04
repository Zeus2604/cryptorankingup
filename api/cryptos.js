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

// Definir lista de símbolos de Base para filtrar
const BASE_SYMBOLS = [
  "BASE", "ETH", "USDT", "USDC", "BNB", "SOL", "DOGE", "TRX", "ADA", "HYPE",
  "LINK", "GRT", "PENDLE", "ENS", "NEXO", "S", "RAY", "RLUSD", "IOTA", "CFX"
  // 🔹 Ajusta o agrega los símbolos que consideres del ecosistema Base
];

app.get("/api/cryptos", async (req, res) => {
  try {
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

    // 🔹 Filtrar solo criptos del ecosistema Base
    const baseCoins = data.data.filter(
      (coin) => BASE_SYMBOLS.includes(coin.symbol)
    );

    // 🔹 Mapear resultados
    const results = baseCoins.map((coin) => ({
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      slug: coin.slug,
      circulating_supply: coin.circulating_supply,
      image: coin.logo || null,
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
