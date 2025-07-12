const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());

app.get("/proxy", async(req, res) => {
    const { page = 1, size = 10, sort = "-published_at" } = req.query;

    const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching from API:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});