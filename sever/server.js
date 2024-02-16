const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/api/getToken", async (req, res) => {
  const body = req.body;
  try {
    const { data } = await axios.post(
      "https://okhasanovdev.amocrm.ru/oauth2/access_token",
      {
        ...body,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/server.js",
      }
    );
    console.log("---------------->data", data);
    res.json(data);
  } catch (err) {
    console.log("---------------->error", err);
    res.send(err);
  }
});

app.post("/api/refreshToken", async (req, res) => {
  const body = req.body;
  try {
    const { data } = await axios.post(
      "https://okhasanovdev.amocrm.ru/oauth2/access_token",
      {
        ...body,
        grant_type: "refresh_token",
        redirect_uri: "http://localhost:3000/server.js",
      }
    );
    console.log("---------------->data", data);
    res.json(data);
  } catch (err) {
    console.log("---------------->error", err);
    res.send(err);
  }
});

app.post("/api/getDeal", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://okhasanovdev.amocrm.ru/api/v4/leads",
      {
        params: {
          ...req.body.params,
        },
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );
    console.log("---------------->data", data);
    res.json(data);
  } catch (err) {
    console.log("---------------->error", err);
    res.send(err);
  }
});

app.post("/api/getNameUser", async (req, res) => {
  try {
    const { data } = await axios.get(
      " https://okhasanovdev.amocrm.ru/api/v4/users/",
      {
        params: {
          ...req.body.params,
        },
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );
    console.log("---------------->dataName", data);
    res.json(data);
  } catch (err) {
    console.log("---------------->error", err);
    res.send(err);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
