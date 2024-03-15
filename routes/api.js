const express = require("express");
const apiRoutes = express.Router();

const UsersController = require("../controllers/UsersController");
const ProductsController = require("../controllers/ProductsController");
const OrdersControllers = require("../controllers/OrdersController");
const DeliverersController = require("../controllers/DeliverersController");

const AuthController = require("../controllers/AuthController");

const {
  userVerification,
  authorization,
} = require("../middlewares/AuthMiddleware");

// Gestion des routes

// PRODUITS Routes
apiRoutes.get("/randomProducts", ProductsController.getHomeProducts);

apiRoutes.route("/ProductsList").get(ProductsController.getProducts);

apiRoutes
  .route("/Product/:id")
  .get(userVerification, ProductsController.getProduct);
apiRoutes.route("/ProductAdd").post(ProductsController.addProduct);
apiRoutes.route("/ProductEdit/:id").put(ProductsController.updateProduct);
apiRoutes.route("/ProductDelete/:id").delete(ProductsController.deleteProduct);

// USER Routes
apiRoutes.route("/Register").post(AuthController.Signup);
apiRoutes.route("/Login").post(AuthController.Login);

apiRoutes.route("/UsersList").get(userVerification, UsersController.getUsers);
apiRoutes.route("/User/:id").get(userVerification, UsersController.getUser);
apiRoutes
  .route("/UserEdit/:id")
  .put(userVerification, UsersController.updateUser);
apiRoutes
  .route("/UserDelete/:id")
  .delete(userVerification, UsersController.deleteUser);

// Orders Routes

apiRoutes.route("/OrdersList").get(OrdersControllers.getOrders);

apiRoutes
  .route("/Order/email/:userEmail")
  .get(OrdersControllers.getOrdersByEMail);
apiRoutes.route("/Order/:id").get(OrdersControllers.getOrder);

apiRoutes.route("/OrderAdd").post(OrdersControllers.addOrder);
apiRoutes.route("/OrderEdit/:id").put(OrdersControllers.updateOrder);
apiRoutes.route("/OrderDelete/:id").delete(OrdersControllers.deleteOrder);

// Livreurs Routes

apiRoutes.route("/DeliverersList").get(DeliverersController.getDeliverers);

apiRoutes
  .route("/Deliverer/:id")
  .get(userVerification, DeliverersController.getDeliverer);
apiRoutes.route("/DelivererAdd").post(DeliverersController.addDeliverer);
apiRoutes.route("/DelivererEdit/:id").put(DeliverersController.updateDeliverer);
apiRoutes
  .route("/DelivererDelete/:id")
  .delete(DeliverersController.deleteDeliverer);

module.exports = apiRoutes;
