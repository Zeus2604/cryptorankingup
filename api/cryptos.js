// api/cryptos.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const CMC_API_KEY = process.env.CMC_API_KEY;

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Endpoint para obtener criptomonedas de Base
app.get("/api/cryptos", async (req, res) => {
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?aux=circulating_supply,market_cap,volume_24h&blockchain_id=8453`;
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
    });

    if (!response.ok) throw new Error("Error al conectar con CoinMarketCap");

    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      throw new Error("No se encontraron criptomonedas en Base");
    }

    const results = data.data.map((coin) => ({
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      slug: coin.slug,
      circulating_supply: coin.circulating_supply,
      image: null,
      last_updated: coin.last_updated,
      quote: {
        USD: {
          price: coin.quote.USD.price,
          volume_24h: coin.quote.USD.volume_24h,
          market_cap: coin.quote.USD.market_cap,
          percent_change_24h: coin.quote.USD.percent_change_24h,
        },
      },
    }));

    res.json(results);
  } catch (error) {
    console.error("Error al obtener criptomonedas de Base:", error);
    res.status(500).json({ error: "Error al obtener datos de CoinMarketCap" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
