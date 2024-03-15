const User = require("../models/UserModels");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware de verification si l'utlisateur est connecté

module.exports.userVerification = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware pour gérer les autorisations via les roles
module.exports.authorization = (roles) => {
  return function (req, res, next) {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).send("Accès Refusé");
    }
    next();
  };
};
