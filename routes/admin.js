const express = require("express");

const adminController = require("../controllers/admin");
const { check, body } = require("express-validator");
const router = express.Router();
const IsAuth = require("../middleware/is-auth");
// /admin/add-product => GET
router.get("/add-product", IsAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", IsAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Title is Required"),
    body("description")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("description is Required"),
    body("price").notEmpty().withMessage("price is Required"),
  ],
  IsAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:id", IsAuth, adminController.getEditProduct);
router.post(
  "/update-product/:id",
  [
    body("title")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Title is Required"),
    body("description")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("description is Required"),
    body("price").notEmpty().withMessage("price is Required"),
  ],
  IsAuth,
  adminController.postUpdateProduct
);

router.delete("/product/:productId", IsAuth, adminController.deleteProduct);
module.exports = router;
