const mongoose = require("mongoose");
const Db = process.env.DB_URL;

//Connexion a mongoDB

mongoose
  .connect(Db, {
    dbName: "ExpressFood",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecté à MongoDb");
  })
  .catch((err) => {
    console.error("Erreur avec la connection à MongoDB:", err);
  });
