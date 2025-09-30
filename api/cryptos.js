// api/cryptos.js
// Backend para Crypto Launch App orientada a Base Blockchain usando BaseScan API

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Endpoint para obtener las criptomonedas de Base
app.get("/api/cryptos", async (req, res) => {
  try {
    // Lista de tokens populares en Base (pueden ajustarse)
    const tokens = [
      { symbol: "cbETH", contract: "0xBeFAaBf..." },
      { symbol: "USDC", contract: "0xFF970A..." },
      { symbol: "DAI", contract: "0x6B1754..." },
    ];

    const results = [];

    // Consultar BaseScan para cada token
    for (const token of tokens) {
      const url = https://api.basescan.org/api?module=stats&action=tokeninfo&contractaddress=${token.contract}&apikey=${BASESCAN_API_KEY};

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error en BaseScan para ${token.symbol}`);

      const data = await response.json();

      results.push({
        name: token.symbol,
        symbol: token.symbol,
        cmc_rank: null,
        slug: token.symbol.toLowerCase(),
        circulating_supply: data.result?.circulatingSupply ?? null,
        image: null,
        last_updated: new Date().toISOString(),
        quote: {
          USD: {
            price: data.result?.priceUSD ?? null,
            volume_24h: data.result?.volume24h ?? null,
            market_cap: data.result?.marketCap ?? null,
            percent_change_24h: data.result?.percentChange24h ?? null,
          },
        },
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error al obtener criptomonedas de Base:", error);
    res.status(500).json({ error: "Error al obtener datos de BaseScan" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
