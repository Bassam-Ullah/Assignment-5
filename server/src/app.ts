import express from "express";
import bodyParser from "body-parser";
import cors = require("cors");

import userRoutes from "./routes/userRoutes";

// import userRoutes from

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);

app.listen(5000, () => {
  console.log("Server is running");
});
