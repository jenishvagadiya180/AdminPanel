import services from "../helper/services.js"
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
var send = services.setResponse;

const errorhandler = (error, req, res, next) => {

    let errorObj = {
        title: error.name,
        routeName: req.path,
        errorData: {
            message: error.message,
            stack: error.stack
        }
    }
    // res.render('error500.ejs');
    send(res, statusCode.SERVER_ERROR, message.SOMETHING_WENT_WRONG, errorObj)
}

export default errorhandler


