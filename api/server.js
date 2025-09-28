import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Tu API Key ahora se toma del secreto en GitHub
const API_KEY = process.env.CMC_API_KEY;

// Ruta principal para servir el HTML
app.use(express.static("public"));

// Endpoint que pide datos a CoinMarketCap
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
      throw new Error("Error en CoinMarketCap");
    }

    const data = await response.json();

    // Filtrar proyectos relacionados con NFTs
    const nftProjects = data.data
      .filter((coin) => coin.tags && coin.tags.includes("nft"))
      .slice(0, 6);

    res.json(nftProjects);
  } catch (error) {
    console.error("Error al obtener NFTs:", error);
    res.status(500).json({ error: "Error al obtener NFTs desde CoinMarketCap" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
