# ExpressFood — API Node.js / Express / MongoDB

Backend du projet collectif ExpressFood, une application de commande de repas. Il fournit les routes de gestion des comptes, produits, commandes et livreurs consommées par le [frontend React](https://github.com/mrcut/expressFood).

**Stack :** Node.js, Express 4, MongoDB, Mongoose 7, bcrypt, jsonwebtoken, dotenv, node-cron.

## Fonctionnalités présentes

- Inscription et connexion ; vérification du mot de passe avec bcrypt et émission d’un JWT lors de la connexion.
- Routes de gestion des utilisateurs, produits, commandes et livreurs.
- Consultation des commandes par email.
- Sélection de produits pour l’accueil et tâche planifiée quotidienne de renouvellement.
- Middleware de vérification des jetons sur certaines routes.

Plusieurs routes de modification ne sont pas protégées dans `routes/api.js` et le middleware d’autorisation par rôle n’y est pas appliqué. Ce projet ne doit donc pas être présenté comme une API dont la sécurité de production a été validée. Les dépendances Redis et Swagger figurent dans `package.json`, mais aucune fonctionnalité de cache ni documentation Swagger opérationnelle n’est revendiquée ici.

## Démarrage local

Prérequis : Node.js 24 / npm et une instance MongoDB accessible. Vercel utilise Node.js 24 pour rester compatible avec les dépendances actuelles.

```sh
git clone https://github.com/mrcut/expressfoodBack.git
cd expressfoodBack
npm ci
```

Créer un fichier `.env` local :

```dotenv
PORT=5003
PORT_CLIENT=http://localhost:5173
DB_URL=mongodb://127.0.0.1:27017
TOKEN_KEY=REMPLACER_PAR_UN_SECRET_LOCAL_LONG_ET_ALEATOIRE
```

Remplacer la valeur d’exemple de `TOKEN_KEY` avant utilisation ; ne pas committer ce fichier. Le nom de base `ExpressFood` est fixé dans [bdd/connexion.js](bdd/connexion.js).

```sh
npm start
```

Lancer ensuite le [frontend](https://github.com/mrcut/expressFood#readme) sur le port 5173. Les routes sont montées directement à la racine de `http://localhost:5003`, sans préfixe `/api`.

### Données de démonstration

Le dépôt ne fournit pas de jeu de données initial ni de compte préconfiguré. Créer un compte via le frontend et préparer des produits et des livreurs avec des données fictives. Un livreur au statut `free` est requis pour le parcours de commande. Le rôle `admin` permet d’accéder aux écrans d’administration du frontend, sans constituer une garantie de contrôle d’accès serveur.

## Déploiement Vercel

- Framework du projet : **Express** ; point d’entrée : `server.js`, exporté en CommonJS.
- Node.js : **24.x**. Node.js 26 provoque une erreur dans une dépendance transitive de l’authentification actuelle.
- Aucune commande de compilation ni dossier de sortie statique personnalisé.
- Variables à définir pour Production : `DB_URL`, `TOKEN_KEY` et `PORT_CLIENT` (origine HTTPS exacte du frontend).
- Redéployer après modification des variables. Ne jamais placer les secrets dans Git.
- `GET /health` retourne 200 si MongoDB est connecté, sinon 503 avec un diagnostic JSON.
- En l’absence de `DB_URL`, les routes métier retournent 503 `DATABASE_NOT_CONFIGURED`.

Le planificateur `node-cron` est conservé en exécution locale uniquement : il n’est pas démarré dans les fonctions Vercel. Le renouvellement quotidien nécessiterait une tâche planifiée Vercel séparée.

Le frontend actuel contient encore des URLs `http://localhost:5003`. Pour un usage depuis le site déployé, ces appels devront pointer vers l’URL HTTPS du backend ; cette adaptation est distincte du démarrage de l’API.

## Routes utiles

| Méthode | Route | Usage |
| --- | --- | --- |
| POST | `/Register` | Inscription |
| POST | `/Login` | Connexion |
| GET | `/ProductsList` | Catalogue |
| GET | `/DeliverersList` | Liste des livreurs |
| POST | `/OrderAdd` | Création d’une commande |
| GET | `/Order/email/:userEmail` | Commandes par email |

Voir [routes/api.js](routes/api.js) pour les autres routes et leurs protections effectives.

## Organisation

- `server.js` : démarrage, CORS et middlewares.
- `routes/` : routes HTTP.
- `controllers/` : traitements métier.
- `models/` : schémas Mongoose.
- `middlewares/` : vérification des jetons et fonction d’autorisation.
- `util/cron.js` : tâche planifiée.

## Aperçu à compléter

> Le rendu utilisateur se trouve dans le frontend. Captures réelles à ajouter après exécution : catalogue et commande avec données fictives. Aucun paiement en ligne ni suivi GPS n’est revendiqué.

## Vérifications

`npm start` lance le serveur et `npm run app` utilise nodemon. Le script `npm test` est un placeholder qui retourne une erreur : il ne constitue pas une suite de tests. La publication Vercel a été testée : l’application Express répond en JSON. Le fonctionnement avec les données nécessite les variables de production et une connexion MongoDB valide.

## Équipe

Crédits conservés du README d’origine :

- [Nicky](https://github.com/Yikkmee) — Développeur principal.
- [Abdellah](https://github.com/Mrcut) — Développeur principal.
- [Doua](https://github.com/Doua) — Chef de projet.

La répartition individuelle des fonctionnalités n’est pas documentée ici ; ce projet est présenté comme un travail collectif.
