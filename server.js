// Importer Express
const express = require("express");
// Utiliser Express
const app = express();
// Importer cors
const cors = require("cors");
// Importer fichier .env
require("dotenv").config({ path: "./.env" });
// Importer la connexion a mongoDb
const connectDatabase = require("./bdd/connexion");

const cronTask = require("./util/cron");

// Le planificateur local nécessite un processus permanent.
if (!process.env.VERCEL) {
  cronTask();
}

const port = process.env.PORT || 5003;

const portClient = process.env.PORT_CLIENT;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: portClient,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
// Attendre MongoDB pendant la requête : Vercel peut suspendre le processus après la réponse.
const databaseStatus = async () => {
  try {
    await connectDatabase();
    return null;
  } catch (error) {
    // Ne jamais journaliser l'URI de connexion ou les identifiants.
    console.error("MongoDB connection failed", { name: error.name, code: error.code });
    return error.code === "DATABASE_NOT_CONFIGURED"
      ? "DATABASE_NOT_CONFIGURED"
      : error.code === 18 ? "DATABASE_AUTHENTICATION_FAILED" : "DATABASE_CONNECTION_FAILED";
  }
};
app.get("/health", async (req, res) => {
  const error = await databaseStatus();
  res.status(error ? 503 : 200).json({
    service: "expressfood-back",
    status: error ? "degraded" : "ok",
    database: error ? "unavailable" : "connected",
    ...(error ? { error } : {}),
  });
});
app.use(async (req, res, next) => {
  const error = await databaseStatus();
  if (error) return res.status(503).json({ error });
  next();
});
app.use(require("./routes/api"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erreur Serveur!");
});
module.exports = app;

if (require.main === module && !process.env.VERCEL) {
  connectDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Serveur ecoute sur le port: ${port}`);
    });
  }).catch((error) => {
    console.error("MongoDB connection failed", { name: error.name, code: error.code });
    process.exitCode = 1;
  });
}
