const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Parse JSON bodies
app.use(express.json());

// Official ECCC GeoJSON Feed URL
const SMC_URL =
  "https://dd.weather.gc.ca/alerts/cap/geodata/EC_alerts_map_polygons_en.geojson";

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Main alerts endpoint
app.get("/api/alerts", async (req, res) => {
  try {
    const response = await axios.get(SMC_URL, {
      timeout: 10000, // 10 second timeout
      headers: {
        "User-Agent": "Weather-Alert-App/1.0",
        Accept: "application/json",
      },
    });

    // Validate response data
    if (!response.data || !response.data.features) {
      throw new Error("Invalid data format from SMC");
    }

    // Add server timestamp to response
    const dataWithTimestamp = {
      ...response.data,
      serverTimestamp: new Date().toISOString(),
    };

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.json(dataWithTimestamp);
  } catch (error) {
    console.error("Error fetching SMC data:", error.message);

    // Determine appropriate status code
    let statusCode = 500;
    if (error.code === "ECONNABORTED") {
      statusCode = 504; // Gateway Timeout
    } else if (error.response && error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      error: "Impossible de récupérer les données météo",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableRoutes: ["/api/alerts", "/health"],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur météo actif sur http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/alerts`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
