const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(express.json());

app.post("/api/getToken", async (req, res) => {
  //   const body = req.body;
  const { data } = await axios.post(
    "https://okhasanovdev.amocrm.ru/oauth2/access_token",
    {
      // body
      client_id: "26fe2bf5-6a9f-4807-b226-66b03f5dad97",
      client_secret:
        "Xt5FETKcgktn4vHgZK8DuSsTefk8Q5l5SnaM3t3AjQ7y2uFSbCZy6Jl254PU8jTz",
      grant_type: "authorization_code",
      code: "def50200894158701203d0e7d9d1760efd604a2d8b278c721769cbf4c3e681669ee225e95997838d91da9df859fecbd625bd607ff7cd150f494f24686fe4b158a2275f2078b160b79ae4384620bed0d37944e7c1a7f760b3444202f7ffb6677d9a6da34aa9b0eb503bb6ef216d074403d5156be908d4968697478cd8e4af1b933e876305f4d304b90f3f430c86f1707e350f980e0ce6c7c5f4931d304f7c0c9f130005d6ec86efd3798655af9d94fe857405b700d8e1a1249a0f97e18c4b690ea939949567d8324d13519b6153844218d2dd4f1e0ebf1a64211c43479352abb9d8ad175234bfdf11e5d39c77554146acff7e0fe41f2e54c5761dd9e698400aeb02b4be57ccd94725f5149fd167e753df6871c71e27ddd93231d03d530e89debfc7acbfa84f6eeb31a3e802c6e0ad56a1de4c32402cd38e2276c705d312a5cd51e54e6e77b2385ad8ac661d34e29058764b70437571196308d3e38450f706ab3892ae9c408722b2e335b088ff2577ae65b46d0ad04edc9b147f46a73caf46a14a3cb0f5ce391cbda3e09e43ee044c01e16dbdbc397ebaac80df16cdb360c5a6d36ef6a952485c2a5e5e81206f28b85f4c68d1686cfc6acf89e734322acbac185ec03d381e74a2c7e4372d6be0299f39a35ec5b4936a634502994296de2ab9a7be855970fcdc06",
      redirect_uri: "http://localhost:3000",
    }
  );
  //   console.log("---------------->head", head);
  console.log("---------------->data.res", data);
  res.json(data);
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
