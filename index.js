const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

//MiddleWare
app.use(cors()); // For avoiding cors policy error
app.use(express.json()); // avoiding body parse json error

// server side url port running check
app.get("/", (req, res) => {
  res.send("Welcome to Travellers Server");
});

//Port Listening check in noodemon console
app.listen(port, () => {
  console.log("Listening to", port);
});
