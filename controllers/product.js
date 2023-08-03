import productModel from "../models/product.js";
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
import fs from "fs";
import imageModel from "../models/image.js";
import mongoose from "mongoose";
import categoryModel from "../models/category.js";
import Stripe from "stripe";
var send = services.setResponse;

class productController {
  static productDataView = async (req, res) => {
    res.render("productData");
  };

  static addProductView = async (req, res) => {
    const categoryData = await categoryModel.find({ isDeleted: false });
    if (!categoryData || categoryData == null) {
      return send(res, statusCode.NOT_FOUND, message.CATEGORY_NOT_FOUND, null);
    }
    res.render("addProduct", { categoryData: categoryData });
  };

  static updateProductView = async (req, res) => {
    let filter = {
      isDeleted: false,
      _id: mongoose.Types.ObjectId(req.params.productId),
    };

    let productData = await productModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          category: "$category.name",
          images: 1,
          _id: 1,
          name: 1,
          description: 1,
          categoryId: 1,
        },
      },
    ]);
    if (!productData || productData == null) {
      return send(res, statusCode.NOT_FOUND, message.PRODUCT_NOT_FOUND, null);
    }
    res.render("updateProduct", { productData: productData });
  };

  /**
   * This function for add product
   * @param {*} req.body.name
   * @param {*} req.body.description
   * @param {*} req.body.categoryId
   * @param {*} req.files.image
   * @returns id
   */
  static addProduct = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const product = new productModel({
        name: req.body.name,
        description: req.body.description,
        categoryId: req.body.categoryId,
      });

      let matchProductName = await productModel.findOne({
        name: req.body.name,
        isDeleted: false,
      });

      if (matchProductName) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.PRODUCT_ALREADY_EXISTS,
          null
        );
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return send(
          res,
          statusCode.REQUIRED_CODE,
          message.PRODUCT_IMAGE_REQUIRED,
          null
        );
      }

      let saveImage = services.imageUploader(req.files.image, product._id);

      const productData = await product.save();
      const imagePath = await imageModel.insertMany(saveImage);

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_ADDED, {
        _id: productData._id,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for get product List
   * @param {*} req.query.page_no
   * @param {*} req.query.perPage
   * @param {*} req.query.sortType
   * @param {*} req.query.sortField
   * @param {*} req.query.search
   * @returns res
   */
  static productList = async (req, res, next) => {
    try {
      var pageNumber = req.query.page_no > 0 ? parseInt(req.query.page_no) : 1;
      var perPage = req.query.perPage > 0 ? parseInt(req.query.perPage) : 10;
      var sortType = !req.query.sortType
        ? 1
        : req.query.sortType.toLowerCase() == "desc"
        ? -1
        : 1;
      var sortField = !req.query.sortField ? "name" : req.query.sortField;

      let filter = { isDeleted: false };
      if (req.query.search) {
        filter = {
          $and: [
            {
              $or: [
                { name: { $regex: `${req.query.search}`, $options: "i" } },
                {
                  description: { $regex: `${req.query.search}`, $options: "i" },
                },
              ],
            },
            { isDeleted: false },
          ],
        };
      }

      let productData = await productModel
        .aggregate([
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $lookup: {
              from: "images",
              localField: "_id",
              foreignField: "productId",
              as: "images",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              category: "$category.name",
              images: {
                $map: {
                  input: "$images",
                  as: "images",
                  in: {
                    $concat: [process.env.url, "$$images.image"],
                  },
                },
              },
              _id: 1,
              name: 1,
              description: 1,
              categoryId: 1,
            },
          },
          {
            $sort: { [sortField]: sortType },
          },
          {
            $skip: (pageNumber - 1) * perPage,
          },
          {
            $limit: perPage,
          },
        ])
        .collation({ locale: "en" });

      const totalRecord = await productModel.find(filter).countDocuments();
      return res.send(
        services.responseData(
          statusCode.SUCCESSFUL,
          message.SUCCESSFUL,
          productData,
          totalRecord
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for get product list  by Id
   * @param {*} req.params.productId
   * @returns res
   */
  static productListById = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkProductId = await productModel.findOne({
        _id: req.params.productId,
        isDeleted: false,
      });
      if (!checkProductId) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.PRODUCT_NOT_FOUND,
          null
        );
      }

      const productData = await productModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.productId) },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            category: "$category.name",
            _id: 1,
            name: 1,
            description: 1,
            categoryId: 1,
          },
        },
      ]);
      return send(
        res,
        statusCode.SUCCESSFUL,
        message.SUCCESSFUL,
        productData[0]
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for update product
   * @param {*} req.params.productId
   * @returns id
   */
  static updateProduct = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkProductId = await productModel.findOne({
        _id: req.params.productId,
        isDeleted: false,
      });
      if (!checkProductId) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.PRODUCT_NOT_FOUND,
          null
        );
      }

      const checkName = await productModel.findOne({
        _id: { $ne: req.params.productId },
        name: req.body.name,
      });
      if (checkName) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.PRODUCT_ALREADY_EXISTS,
          null
        );
      }

      checkProductId.name = req.body.name;
      checkProductId.description = req.body.description;
      checkProductId.categoryId = req.body.categoryId;

      const productData = await checkProductId.save();

      if (req.files) {
        let saveImage = services.imageUploader(
          req.files.image,
          req.params.productId
        );
        const imagePath = await imageModel.insertMany(saveImage);
      }

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, {
        _id: productData._id,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for delete product
   * @param {*} req.params.productId
   * @returns null
   */
  static deleteProduct = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkProductId = await productModel.findOne({
        _id: req.params.productId,
        isDeleted: false,
      });
      if (!checkProductId) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.PRODUCT_NOT_FOUND,
          null
        );
      }

      checkProductId.isDeleted = true;
      const productData = await checkProductId.save();

      return send(res, statusCode.SUCCESSFUL, message.DELETE_SUCCESS, null);
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for delete a product image
   * @param {*} req.params.imageId
   * @returns null
   */
  static deleteImage = async (req, res, next) => {
    try {
      const checkImageId = await imageModel.findOne({
        _id: req.params.imageId,
        isDeleted: false,
      });
      if (!checkImageId) {
        return send(
          res,
          statusCode.NOT_ACCEPTABLE,
          message.IMAGE_NOT_FOUND,
          null
        );
      }

      fs.unlink("." + checkImageId.image, (err) => {
        if (err) {
          console.log("err :>> ", err);
        } else {
          console.log("image deleted successfully");
        }
      });

      const imageData = await imageModel.deleteOne({
        _id: mongoose.Types.ObjectId(req.params.imageId),
      });

      fs.readdir("./uploads/" + checkImageId.productId, function (err, files) {
        if (err) {
          console.log("err :>> ", err);
        }
        if (files.length == 0) {
          fs.rmdir("./uploads/" + checkImageId.productId, () => {
            console.log("Folder Deleted successfully!!!");
          });
        }
      });

      return send(
        res,
        statusCode.SUCCESSFUL,
        message.IMAGE_DELETED_SUCCESSFULLY,
        null
      );
    } catch (error) {
      next(error);
    }
  };

  static purchaseProduct = async (req, res, next) => {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const cardToken = await services.generateCardToken(
        req.body.cardNumber,
        req.body.cardExpireMonth,
        req.body.cardExpireYear,
        req.body.cardCvc
      );

      console.log("cardToken :>> ", cardToken);
      if (cardToken.id) {
        await stripe.charges.create({
          amount: 2000,
          currency: "usd",
          source: cardToken.id,
          description: "My first payment",
        });

        const webhookEndpoint = await stripe.webhookEndpoints.create({
          url: "https://1469-106-201-233-124.in.ngrok.io/admin/product/payment",
          enabled_events: ["charge.failed", "charge.succeeded"],
        });
        console.log("webhookEndpoint :>> ", webhookEndpoint);
        console.log("req.headers :>> ", req.headers);

        return send(
          res,
          statusCode.SUCCESSFUL,
          message.PAYMENT_SUCCESSFUL,
          null
        );
      }

      return send(
        res,
        statusCode.PAYMENT_FAILED,
        message.PAYMENT_FAILED,
        cardToken.error
      );
    } catch (error) {
      next(error);
    }
  };
}

export default productController;
