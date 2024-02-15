const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(express.json());

app.post("/api/getToken", (req, res) => {
  console.log("---------------->req", req);
  // const { data } = await axios.post(
  //     "http://localhost:3000/api/getToken",
  //     {
  //         req.body,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
  //         "Access-Control-Allow-Headers":
  //           "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
  //       },
  //     }
  //   );
  //   console.log("---------------->data", data);
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
