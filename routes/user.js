import express from "express";
const router = express.Router();
import user from '../controllers/user.js';
import auth from "../helper/middleware.js";
import { body, param } from 'express-validator';
import message from "../helper/message.js";


router.get("/view", user.homePageView)
router.get("/signIn/view", user.loginView)
router.get("/register/view", user.registerView);
router.get("/forgotPassword/view", user.forgotPasswordView)
router.get("/recoverPassword/view/:token", user.recoverPasswordView)
router.get("/userData/view", user.userDataView)
router.get("/updateUser/view/:userId", user.updateUserView)
router.get("/addUser/view", user.addUserView);

router.post("/add", auth,
    [
        body("firstName").exists().isLength({ min: 2 }).withMessage(message.INVALID_FIRST_NAME),
        body("lastName").exists().isLength({ min: 2 }).withMessage(message.INVALID_LAST_NAME),
        body("mobileNumber").exists().isInt().withMessage(message.INVALID_MOBILE_NUMBER),
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
        body("password").exists().isLength({ min: 8 }).withMessage(message.INVALID_PASSWORD)
    ]
    , user.addUser);

router.post("/login",
    [
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
        body("password").exists().isLength({ min: 8 }).withMessage(message.INVALID_PASSWORD)
    ]
    , user.userLogin);

router.get("/list", auth, user.userList);

router.put("/update/:userId", auth,
    [
        body("firstName").exists().isLength({ min: 2 }).withMessage(message.INVALID_FIRST_NAME),
        body("lastName").exists().isLength({ min: 2 }).withMessage(message.INVALID_LAST_NAME),
        body("mobileNumber").exists().isInt().withMessage(message.INVALID_MOBILE_NUMBER),
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
        body("password").exists().isLength({ min: 8 }).withMessage(message.INVALID_PASSWORD)
    ]
    , user.updateUser);

router.delete("/delete/:userId", auth,
    param('userId').isMongoId().withMessage(message.INVALID_USER_ID),
    user.deleteUser);

router.post("/forgotPassword",
    [
        body("email").exists().isEmail().withMessage(message.INVALID_EMAIL)
    ]
    , user.forgotPassword);

router.put("/recoverPassword/:token",
    [
        body("newPassword").exists().isLength({ min: 8 }).withMessage(message.INVALID_NEW_PASSWORD),
        body("confirmPassword").exists().isLength({ min: 8 }).withMessage(message.INVALID_CONFIRM_PASSWORD)
    ]
    , user.recoverPassword);


export default router;