// Importer Express
const express = require("express");
// Utiliser Express
const app = express();
// Importer cors
const cors = require("cors");
// Importer fichier .env
require("dotenv").config({ path: "./.env" });
// Importer la connexion a mongoDb
require("./bdd/connexion");

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
// Diagnostic sans lecture ni modification des données métier.
app.get("/health", (req, res) => {
  const databaseReady = require("mongoose").connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    service: "expressfood-back",
    status: databaseReady ? "ok" : "degraded",
    database: databaseReady ? "connected" : "unavailable",
  });
});
app.use((req, res, next) => {
  if (!process.env.DB_URL) {
    return res.status(503).json({ error: "DATABASE_NOT_CONFIGURED" });
  }
  next();
});
app.use(require("./routes/api"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erreur Serveur!");
});
module.exports = app;

if (require.main === module && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Serveur ecoute sur le port: ${port}`);
  });
}
