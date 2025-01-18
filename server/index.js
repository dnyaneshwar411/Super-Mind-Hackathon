import express from "express"
import dotenv from "dotenv";

import userRoutes from "./src/routes/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

/**
 * Middlewares
 */
app.use(cors());
app.use(bodyParser.json());

app.use("/api/user", userRoutes);


app.listen(PORT, () => console.log(`Listening requests on PORT - ${PORT}.`));