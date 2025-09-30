// api/cryptos.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Tu API Key de BaseScan (similar a Etherscan)
const API_KEY = process.env.BASESCAN_API_KEY;

app.use(express.static("public"));

// Endpoint para obtener tokens principales en Base
app.get("/api/cryptos", async (req, res) => {
  try {
    // Ejemplo: obtener tokens con más actividad en Base
    const response = await fetch(
      https://api.basescan.org/api?module=token&action=tokentx&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${API_KEY}
    );

    if (!response.ok) {
      throw new Error("Error en BaseScan");
    }

    const data = await response.json();

    if (data.status !== "1") {
      throw new Error("Respuesta inválida de BaseScan");
    }

    // 🚨 Nota: BaseScan devuelve transacciones, no ranking directo.
    // Vamos a extraer tokens únicos con sus datos básicos.
    const tokensMap = {};

    data.result.forEach((tx) => {
      const symbol = tx.tokenSymbol || "N/A";
      if (!tokensMap[symbol]) {
        tokensMap[symbol] = {
          name: tx.tokenName || "Unknown",
          symbol: symbol,
          contract: tx.contractAddress,
          decimals: tx.tokenDecimal,
          transactions: 0,
        };
      }
      tokensMap[symbol].transactions += 1;
    });

    // Convertimos a array y lo ordenamos por transacciones
    const tokens = Object.values(tokensMap).sort(
      (a, b) => b.transactions - a.transactions
    );

    res.json(tokens.slice(0, 10)); // devolvemos top 10
  } catch (error) {
    console.error("Error al obtener tokens de Base:", error);
    res
      .status(500)
      .json({ error: "Error al obtener criptomonedas desde BaseScan" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
