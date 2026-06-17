import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import ticketRouter from "./routes/ticket.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({limit:"16kb"}));

// Serve static assets from public build folder
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/tickets', ticketRouter);
app.use('/api/analytics', analyticsRouter);

// SPA fallback — serve index.html for any non-API GET request
app.use((req, res, next) => {
  if (req.method !== "GET" || req.url.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;