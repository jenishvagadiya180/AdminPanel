import jwt from "jsonwebtoken";
import statusCode from "./httpStatusCode.js";
import { validationResult } from "express-validator";
import moment from "moment";
import fs from "fs";
import nodeMailer from "nodemailer";
import ejs from "ejs";
import message from "./message.js";
import Twilio from "twilio";
import Stripe from "stripe";

class services {
  static response = (code, message, data) => {
    if (data == null) {
      return {
        status: code,
        message: message,
      };
    } else {
      return {
        status: code,
        message: message,
        responseData: data,
      };
    }
  };

  static hasValidatorErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let msg = "Validation Failed";
      this.setResponse(res, statusCode.REQUIRED_CODE, msg, errors.array());
      return true;
    } else {
      return false;
    }
  };

  static userTokenGenerate = async (id, expireTime) => {
    const token = await jwt.sign({ _id: `${id}` }, process.env.SECURITY_KEY, {
      expiresIn: expireTime,
    });
    return token;
  };

  static jwtVerify(token) {
    try {
      const verifyUser = jwt.verify(token, process.env.SECURITY_KEY);

      if (moment().unix() > verifyUser.exp) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  static imageUploader = (image, id) => {
    if (image.length == undefined) {
      image = [image];
    }

    let saveImage = [];

    fs.mkdirSync(`./uploads/${id}/`, { recursive: true });

    image.forEach((index) => {
      let filePath =
        "./uploads/" +
        `${id}/` +
        Math.random().toString().substr(2, 6) +
        moment().unix() +
        index.name;
      index.mv(filePath, function (err) {
        if (err) {
          console.log("err :>> ", err);
        } else {
          console.log("File Uploaded");
        }
      });
      saveImage.push({ productId: id, image: filePath.substr(1) });
    });
    return saveImage;
  };

  static setResponse = async (res, statusCode, message, data) => {
    await res.send(this.response(statusCode, message, data));
  };

  static responseData(status, message, data, totalRecord) {
    let responseData = {
      status: status,
      message: message,
      data: data,
      recordsTotal: totalRecord,
      recordsFiltered: totalRecord,
    };
    return responseData;
  }

  static sendEmail = async (res, token, email) => {
    console.log("email :>> ", email);
    var transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    console.log("transporter :>> ", transporter);

    ejs.renderFile(
      process.cwd() + "/views/sendEmail.ejs",
      { token: token },
      function (err, data) {
        if (err) {
          console.log(err);
          // Handle the error, e.g., by sending an error response
          return this.setResponse(
            res,
            statusCode.ERROR,
            "Error rendering email template",
            null
          );
        }
        const mailOptions = {
          from: process.env.EMAIL_ID,
          to: email,
          subject: "Reset new Password",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            // Handle the error, e.g., by sending an error response
            return this.setResponse(
              res,
              statusCode.ERROR,
              "Error sending email",
              null
            );
          }

          console.log("Email sent: ");
          // Send the success response after email is sent
          this.setResponse(
            res,
            statusCode.SUCCESSFUL,
            message.EMAIL_SENT_SUCCESSFULLY,
            null
          );
        });
      }
    );
  };

  static sendSms(token) {
    const twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    twilio.messages
      .create({
        body: `${process.env.URL}/admin/user/recoverPassword/view/${token}`,
        from: process.env.TWILIO_PURCHASED_NUMBER,
        to: "+919167678984",
      })
      .then((message) => {
        console.log("message :>> ", message);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static generateCardToken = async (
    number,
    cardExpireMonth,
    cardExpireYear,
    cardCvc
  ) => {
    let stripeToken = {};
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const token = await stripe.tokens.create({
        card: {
          number: number,
          exp_month: cardExpireMonth,
          exp_year: cardExpireYear,
          cvc: cardCvc,
        },
      });
      stripeToken.id = token.id;
    } catch (error) {
      switch (error.type) {
        case "StripeCardError":
          stripeToken.error = error.message;
          break;
        default:
          s;
          stripeToken.error = error.message;
          break;
      }
    }
    return stripeToken;
  };
}

export default services;
