const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors()); // Allows your HTML file to talk to this server

const SMC_URL = "https://dd.weather.gc.ca/alerts/active_alerts.fr.geojson";

app.get("/api/alerts", async (req, res) => {
  try {
    const response = await axios.get(SMC_URL);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching SMC data:", error.message);
    res
      .status(500)
      .json({ error: "Impossible de récupérer les données météo" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
