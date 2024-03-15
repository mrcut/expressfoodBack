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

// Démarrez la tâche cron pour mettre à jour les produits aléatoires quotidiennement
cronTask();

const port = process.env.PORT;

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
app.use(require("./routes/api"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erreur Serveur!");
});
app.listen(port, () => {
  console.log(`Serveur ecoute sur le port: ${port}`);
});
