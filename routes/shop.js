const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();
const IsAuth = require("../middleware/is-auth");
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProduct);

router.get("/cart", IsAuth, shopController.getCart);

router.post("/cart", IsAuth, shopController.postCart);

router.post("/cart-delete-item", IsAuth, shopController.postCartDeleteProduct);

router.get("/orders", IsAuth, shopController.getOrders);

router.post("/create-order", IsAuth, shopController.postOrder);

router.get('/order/:orderId',IsAuth,shopController.getOrderById)
module.exports = router;
