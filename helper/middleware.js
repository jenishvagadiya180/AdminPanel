import services from "../helper/services.js";
import statusCode from "../helper/httpStatusCode.js";
import message from "../helper/message.js";
import jwt_decode from "jwt-decode";
import userModel from "../models/user.js";
import mongoose from "mongoose";


const auth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
      return res.status(statusCode.UNAUTHORIZED).send(services.response(statusCode.UNAUTHORIZED, message.UNAUTHORIZED, null));
    }

    const token = headerToken.split(' ')[1];
    const verify = services.jwtVerify(token);

    if (verify) {
      return res.status(statusCode.UNAUTHORIZED).send(services.response(statusCode.UNAUTHORIZED, message.INVALID_TOKEN, null));
    }

    const decoded = jwt_decode(token);
    const userData = await userModel.findById(mongoose.Types.ObjectId(decoded._id))
    req.user = userData
    next();
  }
  catch (error) {
    return res.status(statusCode.ERROR_OCCURRED).send(services.response(statusCode.UNAUTHORIZED, message.INTERNAL_SERVER_ERROR, null));
  }
}


export default auth;