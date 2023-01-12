import userModel from "../models/user.js"
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import jwt_decode from "jwt-decode";
import mongoose from "mongoose";
import Twilio from "twilio";
const send = services.setResponse;


class user {
  static homePageView = function (req, res) {
    res.render('index')
  }

  static forgotPasswordView = function (req, res) {
    res.render('forgotPassword');
  }

  static loginView = function (req, res) {
    res.render('login')
  }

  static recoverPasswordView = function (req, res) {
    const token = req.params.token;
    res.render('recoverPassword', { token: token });
  }

  static registerView = function (req, res) {
    res.render('register')
  }

  static userDataView = async function (req, res) {
    res.render('userData');
  }

  static addUserView = function (req, res) {
    res.render('addUser');
  }

  static updateUserView = async function (req, res) {
    const userData = await userModel.findOne({ _id: req.params.userId, isDeleted: false });
    if (!userData || userData == null) {
      return send(res, statusCode.NOT_FOUND, message.USER_NOT_FOUND, null)
    }
    res.render('updateUser', { userData: userData });
  }

  /**
  * This function for add user
  * @param {*} req.body.firstName 
  * @param {*} req.body.lastName 
  * @param {*} req.body.mobileNumber   
  * @param {*} req.body.email   
  * @param {*} req.body.password         
  * @returns id
  */
  static addUser = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      let matchEmail = await userModel.findOne({ email: req.body.email });
      if (matchEmail) {
        return send(res, statusCode.NOT_FOUND, message.USER_ALREADY_EXISTS, null)
      }

      const user = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: req.body.password,
      });

      const userData = await user.save();
      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_REGISTERED, { "_id": userData._id })

    } catch (error) {
      console.log('error :>> ', error);
      next(error)
    }
  }

  /**
   * This function for user login
   * @param {*} req.body.email
   * @param {*} req.body.password  
   * @returns res
   */
  static userLogin = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }
      const userData = await userModel.findOne({ email: req.body.email, isDeleted: false });
      if (!userData) {
        return send(res, statusCode.BAD_REQUEST, message.INVALID_EMAIL, null)
      }
      if (userData.email == req.body.email && userData.password == req.body.password) {
        const token = await services.userTokenGenerate(userData._id.toString(), process.env.EXPIRE_TIME);

        const userObj = {
          firstName: userData.firstName,
          id: userData.id,
          token: token
        }
        return send(res, statusCode.SUCCESSFUL, message.LOGIN_SUCCESSFUL, userObj)
      }
      return send(res, statusCode.BAD_REQUEST, message.INVALID_PASSWORD, null)
    } catch (error) {
      next(error)
    }
  }

  /**
     * This function for get user List
     * @param {*} req.query.pageNumber 
     * @param {*} req.query.perPage 
     * @param {*} req.query.sortType
     * @param {*} req.query.sortField
     * @param {*} req.query.search
     * @returns res
     */
  static userList = async (req, res, next) => {
    try {
      var pageNumber = !req.query.pageNumber ? 1 : parseInt(req.query.pageNumber)
      var perPage = !req.query.perPage ? 10 : parseInt(req.query.perPage)
      var sortType = req.query.sortType == null || !req.query.sortType ? 1 : (req.query.sortType.toLowerCase() == "desc" ? -1 : 1)
      var sortField = req.query.sortField == null || !req.query.sortField ? "firstName" : req.query.sortField
      var search = req.query.search == null ? '[^\n]+' : `^${req.query.search}`

      var filter = {
        $and: [
          { isDeleted: false },
          {
            "$or": [
              { firstName: { '$regex': search, '$options': 'i' } },
              { lastName: { '$regex': search, '$options': 'i' } },
              { email: { '$regex': search, '$options': 'i' } },
              { mobileNumber: { '$regex': search, '$options': 'i' } },
              { password: { '$regex': search, '$options': 'i' } }
            ]
          }]
      }
      const userData = await userModel.aggregate([
        { $match: filter },
        { "$project": { "_id": 1, "firstName": 1, "lastName": 1, "mobileNumber": 1, "email": 1, "password": 1, } },
        { "$sort": { [sortField]: sortType } },
        { $skip: (pageNumber - 1) * perPage },
        { $limit: perPage }
      ]).collation({ locale: "en" })

      const totalRecord = await userModel.find(filter).countDocuments();
      return res.send(
        services.responseData(statusCode.SUCCESSFUL, message.SUCCESSFUL, userData, totalRecord)
      );
    } catch (error) {
      next(error)
    }
  }

  /**
  * This function for update user
  * @param {*} req.params.userId 
  * @returns id
  */
  static updateUser = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkUserId = await userModel.findOne({ "_id": req.params.userId, isDeleted: false })
      if (!checkUserId) {
        return send(res, statusCode.NOT_FOUND, message.USER_NOT_FOUND, null)
      }

      const checkUserName = await userModel.findOne({ "_id": { $ne: req.params.userId }, "email": req.body.email })
      if (checkUserName) {
        return send(res, statusCode.NOT_FOUND, message.USER_ALREADY_EXISTS, null)
      }

      checkUserId.firstName = req.body.firstName;
      checkUserId.lastName = req.body.lastName;
      checkUserId.mobileNumber = req.body.mobileNumber;
      checkUserId.email = req.body.email;
      checkUserId.password = req.body.password;
      const userData = await checkUserId.save();

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, { "_id": userData._id })
    }
    catch (error) {
      next(error)
    }
  }


  /**
 * This function for delete user
 * @param {*} req.params.userId   
 * @returns null
 */
  static deleteUser = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkUserId = await userModel.findOne({ "_id": req.params.userId, isDeleted: false })
      if (!checkUserId) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.USER_NOT_FOUND, null)
      }

      checkUserId.isDeleted = true;
      const userData = await checkUserId.save();

      return send(res, statusCode.SUCCESSFUL, message.DELETE_SUCCESS, null)
    } catch (error) {
      next(error)
    }
  }

  /**
     * This function for forgotPassword
     * @param {*} req.body.email
     * @returns  message
     */
  static forgotPassword = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }
      const checkEmail = await userModel.findOne({ email: req.body.email, isDeleted: false });
      if (!checkEmail) {
        return send(res, statusCode.BAD_REQUEST, message.INVALID_EMAIL, null)
      }
      const token = await services.userTokenGenerate(checkEmail._id, '10m');

      services.sendEmail(res, token, req.body.email);
      services.sendSms(token);
    } catch (error) {
      next(error)
    }
  }

  /**
  * This function for recover password
  * @param {*} req.params.token 
  * @returns id
  */
  static recoverPassword = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const token = req.params.token;
      const verify = services.jwtVerify(token);

      if (verify) {
        return send(res, statusCode.UNAUTHORIZED, message.INVALID_TOKEN, null)
      }

      const decoded = jwt_decode(token);
      const checkUserData = await userModel.findById(mongoose.Types.ObjectId(decoded._id))
      if (!checkUserData) {
        return send(res, statusCode.NOT_FOUND, message.USER_NOT_FOUND, null)
      }

      if (req.body.newPassword == req.body.confirmPassword) {
        checkUserData.password = req.body.newPassword;
        const userData = await checkUserData.save();
        return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, { userId: userData._id })
      }
      return send(res, statusCode.BAD_REQUEST, message.PASSWORD_NOT_MATCHED, null)

    }
    catch (error) {
      next(error)
    }
  }

};


export default user;
