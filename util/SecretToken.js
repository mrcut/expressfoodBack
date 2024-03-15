require("dotenv").config();
const jwt = require("jsonwebtoken");

// Créer un token

module.exports.createSecretToken = (id, user) => {
    return jwt.sign({id, role : user.role, email : user.email, nom : user.nom, prenom : user.prenom} , process.env.TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
}
