import express, { Express } from "express";
import { PORT } from "./config/config";
import Database from "./database/dbConnection";
import indexRoute from "./routes/index";

const database = new Database();
const app: Express = express();
const port = PORT || 8000;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json("Server health is okay.");
});

app.use("/v1", indexRoute);

app.listen(port, async () => {
  try {
    await database.connect();
    console.log(`MySQL connected!`);
    console.log(`Server connected-Port:${port}`);
    console.log(
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
    );
  } catch (error) {
    console.error(error);
    console.error(`Unable to connect to database.`);
    console.error(`Error-${error}`);
    process.stdin.emit("SIGINT");
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.info("Gracefully shutting down");
  await database.disConnect();
  console.info("MySql Database Disconnected");
  process.exit(0);
});
