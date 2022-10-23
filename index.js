const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

//MiddleWare
app.use(cors()); // For avoiding cors policy error
app.use(express.json()); // avoiding body parse json error

//MongoDb connection Start

//MongoDB user Config from mongodb and securing PASS and User by dotenv
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvdy64o.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Async function to connect & Operate mongo
async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    const serviceCollection = client.db("travellersDb").collection("services");

    // receiving post method data from client side & ADD to Db

    app.post("/servicedata", async (req, res) => {
      const servicedata = req.body;
      // ADD single data to DATABASE
      const result = await serviceCollection.insertOne(servicedata);
      res.send(result);
    });

    // Loading or Creating own server api READ data from Mongodb

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const tasklistfromdb = await cursor.toArray();
      res.send(tasklistfromdb);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// server side url port running check
app.get("/", (req, res) => {
  res.send("Welcome to Travellers Server");
});

//Port Listening check in noodemon console
app.listen(port, () => {
  console.log("Listening to", port);
});
