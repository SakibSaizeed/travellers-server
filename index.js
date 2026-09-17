const express = require("express");
const cors = require("cors");
const compression = require("compression");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors()); // For avoiding cors policy error
app.use(compression()); // gzip responses so the client downloads less data per request
app.use(express.json()); // avoiding body parse json error

//<----MongoDb connection config Start----->

//MongoDB user Config from mongodb and securing PASS and User by dotenv
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvdy64o.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  maxPoolSize: 20,
  // fail fast instead of hanging ~30s (driver default) when Atlas is unreachable
  serverSelectionTimeoutMS: 8000,
});

let serviceCollection;
let bookingCollection;

const isValidId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

// server side url port running check
app.get("/", (req, res) => {
  res.send("Welcome to Travellers Server");
});

// receiving post method service data from client side & ADD to Db
app.post("/servicedata", async (req, res) => {
  try {
    const servicedata = req.body;
    const result = await serviceCollection.insertOne(servicedata);
    res.send(result);
  } catch (error) {
    console.error("POST /servicedata failed:", error);
    res.status(500).send({ message: "Failed to add service" });
  }
});

// receiving post method booking data from client side & ADD to travellersDb.booking
app.post("/bookingdata", async (req, res) => {
  try {
    const bookingdata = req.body; //data inputed from client booking ui
    const bookingresult = await bookingCollection.insertOne(bookingdata);
    res.send(bookingresult);
  } catch (error) {
    console.error("POST /bookingdata failed:", error);
    res.status(500).send({ message: "Failed to add booking" });
  }
});

// Loading or Creating own server api READ data from travellersDb.services
// Supports optional ?search=&category=&location=&sort=price_asc|price_desc|rating&limit=
// With no query params it behaves exactly as before (full array), so existing client calls keep working.
app.get("/services", async (req, res) => {
  try {
    const { search, category, location, sort, limit } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (location) query.location = location;

    const sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else if (sort === "rating") sortOptions.rating = -1;

    let cursor = serviceCollection.find(query).sort(sortOptions);

    const limitNum = parseInt(limit, 10);
    if (Number.isInteger(limitNum) && limitNum > 0) {
      cursor = cursor.limit(Math.min(limitNum, 100));
    }

    const tasklistfromdb = await cursor.toArray();
    res.send(tasklistfromdb);
  } catch (error) {
    console.error("GET /services failed:", error);
    res.status(500).send({ message: "Failed to load services" });
  }
});

//  READ  own server api for bookingdata READ data from Mongodb
app.get("/bookingdata", async (req, res) => {
  try {
    const query = {};
    const cursor = bookingCollection.find(query);
    const bookingDatafromDb = await cursor.toArray();
    res.send(bookingDatafromDb);
  } catch (error) {
    console.error("GET /bookingdata failed:", error);
    res.status(500).send({ message: "Failed to load booking data" });
  }
});

//! Read A specific Document from DB by id
app.get("/services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) {
      return res.status(400).send({ message: "Invalid service id" });
    }
    const serviceapi = await serviceCollection.findOne({ _id: new ObjectId(id) });
    if (!serviceapi) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.send(serviceapi);
  } catch (error) {
    console.error("GET /services/:id failed:", error);
    res.status(500).send({ message: "Failed to load service" });
  }
});

// Related tours: other tours sharing the same category (falls back to location), for a
// "related tours" section on the client's tour details page.
app.get("/services/:id/related", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) {
      return res.status(400).send({ message: "Invalid service id" });
    }

    const current = await serviceCollection.findOne({ _id: new ObjectId(id) });
    if (!current) {
      return res.status(404).send({ message: "Service not found" });
    }

    const limitNum = Math.min(parseInt(req.query.limit, 10) || 6, 20);
    const matchStage = { _id: { $ne: current._id } };

    if (current.category) {
      matchStage.category = current.category;
    } else if (current.location) {
      matchStage.location = current.location;
    }

    let related = await serviceCollection.find(matchStage).limit(limitNum).toArray();

    // Not enough matches by category/location? Top up with other random tours.
    if (related.length < limitNum) {
      const excludeIds = [current._id, ...related.map((doc) => doc._id)];
      const fillers = await serviceCollection
        .find({ _id: { $nin: excludeIds } })
        .limit(limitNum - related.length)
        .toArray();
      related = related.concat(fillers);
    }

    res.send(related);
  } catch (error) {
    console.error("GET /services/:id/related failed:", error);
    res.status(500).send({ message: "Failed to load related services" });
  }
});

// ! DELETE data from Mongodb
app.delete("/services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) {
      return res.status(400).send({ message: "Invalid service id" });
    }
    const deletedResult = await serviceCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(deletedResult);
  } catch (error) {
    console.error("DELETE /services/:id failed:", error);
    res.status(500).send({ message: "Failed to delete service" });
  }
});

//Async function to connect & Operate mongo, then only start accepting traffic once
//the DB + indexes are ready (avoids "Cannot GET /services" race on a cold start).
async function run() {
  await client.connect();

  serviceCollection = client.db("travellersDb").collection("services");
  bookingCollection = client.db("travellersDb").collection("booking");

  // Indexes so filtering/searching/sorting stay fast as the collection grows
  await Promise.all([
    serviceCollection.createIndex({ category: 1 }),
    serviceCollection.createIndex({ location: 1 }),
    serviceCollection.createIndex({ title: "text", name: "text", description: "text" }),
    bookingCollection.createIndex({ email: 1 }),
  ]);

  app.listen(port, () => {
    console.log("Listening to", port);
  });
}

run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
