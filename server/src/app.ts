import express from "express";
import cors from "cors";

import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";

const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes); 
app.use("/api/leads", leadRoutes);

export default app;