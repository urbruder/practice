import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cors from "cors";
import userRoutes from './routes/user.routes.js'



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes );

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT ||8000;
app.get("/", (req, res) => {
  res.send("API running");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
