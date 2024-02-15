const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(express.json());

app.post("/api/getToken", (req, res) => {});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
