import express from "express";
import fetch from "node-fetch";

const app = express();

// Tu API Key ahora se toma del secreto en GitHub
const API_KEY = process.env.CMC_API_KEY;

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Endpoint para obtener NFTs desde CoinMarketCap
app.get("/api/nfts", async (req, res) => {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error en CoinMarketCap");
    }

    const data = await response.json();

    // Filtrar proyectos relacionados con NFTs (sin límite)
    const nftProjects = data.data.filter(
      (coin) => coin.tags && coin.tags.includes("nft")
    );

    res.status(200).json(nftProjects);
  } catch (error) {
    console.error("Error al obtener NFTs:", error);
    res.status(500).json({ error: "Error al obtener NFTs desde CoinMarketCap" });
  }
});

// Exportar la app para que Vercel la maneje como función serverless
export default app;
