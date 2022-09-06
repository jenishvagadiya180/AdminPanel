import express from "express";
const router = express.Router();
import categoryController from "../controllers/category.js"
import { param, body } from 'express-validator';
import message from '../helper/message.js';
import auth from "../helper/middleware.js";

router.get("/categoryData/view", categoryController.categoryDataView)
router.get("/updateCategory/view/:categoryId", categoryController.updateCategoryView)
router.get("/addCategory/view", categoryController.addCategoryView)

router.post("/add", auth,
    body("name").exists().isLength({ min: 2 }).withMessage(message.INVALID_CATEGORY_NAME),
    categoryController.addCategory);

router.get("/list", auth, categoryController.categoryList);

router.get("/list/:categoryId", auth,
    param('categoryId').isMongoId().withMessage(message.INVALID_CATEGORY_ID),
    categoryController.categoryListById);

router.put("/update/:categoryId", auth,
    [
        param('categoryId').isMongoId().withMessage(message.INVALID_CATEGORY_ID),
        body("name").exists().isLength({ min: 2 }).withMessage(message.INVALID_CATEGORY_NAME)
    ],
    categoryController.updateCategory);

router.delete("/delete/:categoryId", auth,
    param('categoryId').isMongoId().withMessage(message.INVALID_CATEGORY_ID),
    categoryController.deleteCategory);


export default router;