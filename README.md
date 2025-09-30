# Crypto Launch App - Base Ecosystem 🚀

Mini-app que muestra las principales criptomonedas del ecosistema Base con datos en tiempo real:

- ✅ Precio en USD  
- ✅ Cambio porcentual en 24h  
- ✅ Market Cap  
- ✅ Volumen 24h  
- ✅ Circulating Supply  
- ✅ Ranking  

---

## 🚀 Cómo funciona
- El backend (`api/cryptos.js`) usa la API pública de CoinGecko (categoría: `base-ecosystem`) para obtener datos de los tokens de Base.  
- El frontend (`public/crypto.html`) consume el endpoint /api/cryptos y renderiza tarjetas con la información.  

---

## 📂 Estructura
