import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.CMC_API_KEY;

app.use(express.static("public"));

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

    // Filtrar proyectos que contienen "nft" en su nombre o descripción
    const nftProjects = data.data.filter((coin) => {
      const name = coin.name.toLowerCase();
      const description = coin.description ? coin.description.toLowerCase() : "";
      return name.includes("nft") || description.includes("nft");
    });

    res.json(nftProjects);
  } catch (error) {
    console.error("Error al obtener NFTs:", error);
    res.status(500).json({ error: "Error al obtener NFTs desde CoinMarketCap" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
