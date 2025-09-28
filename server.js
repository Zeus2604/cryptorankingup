// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS (para que tu frontend pueda llamar al backend)
app.use(cors());

// Tu API Key de CoinMarketCap (guardala como variable de entorno en GitHub)
const API_KEY = process.env.CMC_API_KEY;

// Endpoint para obtener proyectos NFT
app.get("/api/nfts", async (req, res) => {
  try {
    const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta de CoinMarketCap");
    }

    const data = await response.json();

    // Filtrar solo proyectos relacionados con NFTs
    const nftProjects = data.data.filter(
      (coin) => coin.tags && coin.tags.includes("nft")
    ).slice(0, 6);

    res.json(nftProjects);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al cargar los NFTs" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
