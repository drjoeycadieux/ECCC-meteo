const axios = require("axios");

// Official ECCC GeoJSON Feed URL
const SMC_URL =
  "https://dd.weather.gc.ca/alerts/cap/geodata/EC_alerts_map_polygons_en.geojson";

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

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

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      body: JSON.stringify(dataWithTimestamp),
    };
  } catch (error) {
    console.error("Error fetching SMC data:", error.message);

    // Determine appropriate status code
    let statusCode = 500;
    if (error.code === "ECONNABORTED") {
      statusCode = 504; // Gateway Timeout
    } else if (error.response && error.response.status) {
      statusCode = error.response.status;
    }

    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Impossible de récupérer les données météo",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
