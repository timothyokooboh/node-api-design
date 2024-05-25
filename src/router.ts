import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "./db";
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getAllUpdates,
  getOneUpdate,
  updateUpdate,
} from "./handlers/update";

const router = Router();

const validateRequest = async (req, res, next) => {
  const id = router.params.id;
  if (!id) {
    res.json({
      status: "400",
      message: "Product id is required",
    });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    res.json({
      status: 404,
      message: "The product you are trying to update does not exist",
    });
    return;
  }

  if (req.user.id !== product.belongsToId) {
    res.json({
      status: 401,
      message: "Not authorized",
    });

    return;
  }

  next();
};

/**
 * PRODUCT
 */

router.post("/product", [
  body("name").notEmpty().isString(),
  handleInputErrors,
  createProduct,
]);

router.put(
  "/product/:id",
  [body("name").notEmpty().isString(), handleInputErrors],
  updateProduct,
);

router.get("/product", getAllProducts);

router.get("/product/:id", getOneProduct);

router.delete("/product/:id", deleteProduct);

/**
 * UPDATE
 */

router.post(
  "/update",
  [
    body("title").notEmpty().isString(),
    body("body").notEmpty().isString(),
    body("productId").notEmpty().isString(),
    body("status").optional().isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
    body("assets").optional().isString(),
    body("version").optional().isString(),
    handleInputErrors,
  ],
  createUpdate,
);
router.put(
  "/update/:id",
  [
    body("title").optional().isString(),
    body("body").optional().isString(),
    body("status").optional().isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
    body("assets").optional().isString(),
    body("version").optional().isString(),
    handleInputErrors,
  ],
  updateUpdate,
);
router.get("/update", getAllUpdates);
router.get("/update/:id", getOneUpdate);
router.delete("/update/:id", deleteUpdate);

/**
 * UPDATEPOINT
 */

router.post(
  "/updatepoint",
  [
    body("name").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("updateId").notEmpty().isString(),
  ],
  () => {},
);
router.put(
  "/updatepoint/:id",
  [
    body("name").notEmpty().isString(),
    body("description").optional().isString(),
  ],
  () => {},
);
router.get("/updatepoint", () => {});
router.get("/updatepoint/:id", () => {});
router.delete("/updatepoint/:id", () => {});

// error handler
router.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: err.message });
  } else if (err.type === "input") {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
});

export default router;
