import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const PORT = 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
