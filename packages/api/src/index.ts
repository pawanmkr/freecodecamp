import path from "path";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/routes.js";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import morgan from "morgan";
import { preSeeding } from "./seedData.js";
import { healthCheck } from "./keepServerAlive.js";

dotenv.config({
  path: path.join(process.cwd(), "../../.env"),
});

const app: Express = express();
const PORT: string | number = process.env.PORT || 8080;
const MONGO_URI: string | undefined = process.env.DB_CONN_STRING;

/* Middlewares */
app.use(morgan("dev"));
app.use(express.json());
app.use((req: Request, res: Response, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    app.use(express.urlencoded({ extended: true }));
  }
  next();
});

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* DATABASE CONNECTION */
let mongooseInstance: Mongoose | null = null;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 5000;

const connectWithMongo = () => {
  if (MONGO_URI === undefined) throw new Error("MongoDB URI not found");
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true } as ConnectOptions)
    .then(async () => {
      mongooseInstance = mongoose;
      console.log("Connected to MongoDB");
      retryAttempts = 0;
      await preSeeding();
      setTimeout(() => {
        healthCheck("http://localhost:8088/health");
      }, 10000);
    })
    .catch((err) => {
      console.error(`Failed to connect to MongoDB: ${err.error}`);

      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
        retryAttempts++;
        setTimeout(connectWithMongo, RETRY_DELAY);
      } else {
        console.error("Max retry attempts reached. Exiting...");
        process.exit(1);
      }
    });
};
connectWithMongo();

// Health check
app.get("/health", (req: Request, res: Response, next) => {
  res.sendStatus(200);
});

app.use("/api/v1", router);

const server = app.listen(PORT, () => {
  let url: string = `http://localhost:${PORT}`;
  if (process.env.NODE_ENV === "production") {
    url = "https://fcc-lol8.onrender.com";
  }
  console.log(`\nServer running at ${url}`);
});

process.on("SIGINT", () => {
  if (mongooseInstance) {
    mongoose.connection.close();
    console.log("Mongoose default connection closed");
  }
  server.close();
});
