import express from "express";
const router = express.Router();
import productController from "../controllers/product.js";
import { param, body } from 'express-validator';
import message from '../helper/message.js'
import auth from "../helper/middleware.js";


router.get("/productData/view", productController.productDataView)

router.get("/updateProduct/view/:productId", productController.updateProductView)

router.get("/addProduct/view", productController.addProductView)

router.post("/add",
    [
        body("name").exists().isLength({ min: 2 }).withMessage(message.INVALID_PRODUCT_NAME),
        body("description").exists().isLength({ min: 2 }).withMessage(message.INVALID_PRODUCT_DESCRIPTION),
        body('categoryId').isMongoId().withMessage(message.INVALID_CATEGORY_ID)
    ],
    productController.addProduct);

router.get("/list", auth, productController.productList);

router.get("/list/:productId", auth,
    param('productId').isMongoId().withMessage(message.INVALID_CATEGORY_ID),
    productController.productListById);

router.put("/update/:productId", auth,
    [
        param('productId').isMongoId().withMessage(message.INVALID_PRODUCT_ID),
        body("name").exists().isLength({ min: 2 }).withMessage(message.INVALID_PRODUCT_NAME),
        body("description").exists().withMessage(message.INVALID_PRODUCT_DESCRIPTION),
        body('categoryId').isMongoId().withMessage(message.INVALID_CATEGORY_ID)
    ],
    productController.updateProduct);

router.delete("/delete/:productId", auth,
    param('productId').isMongoId().withMessage(message.INVALID_PRODUCT_ID),
    productController.deleteProduct)

router.delete("/image/delete/:imageId", auth,
    param('imageId').isMongoId().withMessage(message.INVALID_IMAGE_ID),
    productController.deleteImage)

router.post("/payment", productController.purchaseProduct)


export default router;