import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import userRoutes from "./src/routes/user.routes.js";
import connectToDatabase from "./src/config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/user", userRoutes);

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Listening requests on PORT - ${PORT}.`)
});