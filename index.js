const express = require("express");
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function run() {
  const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@ema-jhon.rej5vek.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLACTON);
    const orderCollection = client.db(process.env.DB_NAME).collection(process.env.ORDER_COLLACTION );

    app.post("/confirmOrder", async (req,res) => {
       try { 
        const data = req.body
        const orderConfirm = await orderCollection.insertOne(data)
        res.send(orderConfirm)
        
       } catch (error) {
        console.log(error)
       }
    })


    app.post("/addProduct", async (req, res) => {
      try {
        const data = req.body;
        const dbData = await collection.insertMany(data);
        res.send(dbData);
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      }
    });

    app.get("/products" , async (req,res) => {
      try{
        const data = await collection.find({}).toArray()
        res.send(data)
      }catch (err) {
        console.log(err)
      }
    })

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    // Handle error if needed
  }
}

run().catch(console.dir);
