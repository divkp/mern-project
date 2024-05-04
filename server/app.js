import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes.js";
import { connection } from "./mongodb.js";
import dotenv from "dotenv";

const app = express();

// Configure CORS
app.use(cors());
dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

connection();

app.listen(8000, () => {
  console.log("Server running successfully");
});
