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

// Endpoint para obtener criptomonedas de Base
app.get("/api/cryptos", async (req, res) => {
  try {
    // ✅ Endpoint de categoría Base Ecosystem (ID 1127 en CMC)
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=1127";

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
    });

    if (!response.ok) throw new Error("Error al conectar con CoinMarketCap");

    const data = await response.json();
    if (!data.data  !data.data.coins  data.data.coins.length === 0) {
      throw new Error("No se encontraron criptomonedas en Base");
    }

    // 🔹 CoinMarketCap devuelve los tokens en "data.coins"
    const results = data.data.coins.map((coin) => ({
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      slug: coin.slug,
      circulating_supply: coin.circulating_supply,
      image: coin.logo || null, // Si CoinMarketCap da logo, lo usamos
      last_updated: coin.last_updated,
      quote: coin.quote ? {
        USD: {
          price: coin.quote.USD.price,
          volume_24h: coin.quote.USD.volume_24h,
          market_cap: coin.quote.USD.market_cap,
          percent_change_24h: coin.quote.USD.percent_change_24h,
        },
      } : null,
    }));

    res.json(results);
  } catch (error) {
    console.error("Error al obtener criptomonedas:", error);
    res.status(500).json({ error: "Error al obtener datos de CoinMarketCap" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
