import categoryModel from "../models/category.js"
import services from "../helper/services.js";
import message from "../helper/message.js";
import statusCode from "../helper/httpStatusCode.js";
var send = services.setResponse;

class categoryController {

  static categoryDataView = async function (req, res) {
    res.render('categoryData');
  }
  static addCategoryView = async function (req, res) {
    res.render('addCategory');
  }

  static updateCategoryView = async (req, res, next) => {
    try {
      const categoryData = await categoryModel.findOne({ _id: req.params.categoryId, isDeleted: false });
      if (!categoryData) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.CATEGORY_NOT_FOUND, null)
      }
      res.render('updateCategory', { categoryData: categoryData });
    } catch (error) {
      next(error)
    }
  }

  /**
   * This function for add category
   * @body {*} req.body.name    
   * @returns id
   */
  static addCategory = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      let matchName = await categoryModel.findOne({ name: req.body.name, isDeleted: false });

      if (matchName) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.CATEGORY_ALREADY_EXISTS, null)
      }

      const category = new categoryModel({
        name: req.body.name
      });

      const categoryData = await category.save();
      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_ADDED, { "_id": categoryData._id })
    } catch (error) {
      next(error)
    }
  }

  /**
   * This function for get category List
   * @param {*} req.query.page_no 
   * @param {*} req.query.perPage 
   * @param {*} req.query.sortType
   * @param {*} req.query.sortField
   * @param {*} req.query.search
   * @returns res
   */
  static categoryList = async (req, res, next) => {
    try {
      var pageNumber = !req.query.pageNumber ? 1 : parseInt(req.query.pageNumber)
      var perPage = !req.query.perPage ? 10 : parseInt(req.query.perPage)
      var sortType = req.query.sortType == null || !req.query.sortType ? 1 : (req.query.sortType.toLowerCase() == "desc" ? -1 : 1)
      var sortField = req.query.sortField == null || !req.query.sortField ? "name" : req.query.sortField
      var search = req.query.search == null ? '[^\n]+' : `^${req.query.search}`

      var filter = {
        $and: [
          {
            isDeleted: false
          },
          {
            name: { '$regex': search, '$options': 'i' }
          }]
      }

      let categoryData = await categoryModel.aggregate([
        { $match: filter },
        { "$project": { "_id": 1, "name": 1, } },
        { $sort: { [sortField]: sortType } },
        { $skip: (pageNumber - 1) * perPage },
        { $limit: perPage }
      ]).collation({ locale: "en" })

      const totalRecord = await categoryModel.find(filter).countDocuments();

      return res.send(
        services.responseData(statusCode.SUCCESSFUL, message.SUCCESSFUL, categoryData, totalRecord)
      );
    } catch (error) {
      next(error)
    }
  }

  /**
   * This function for get category list by id
   * @param {*} req.params.categoryId 
   * @returns res
   */
  static categoryListById = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }
      const categoryData = await categoryModel.find({ isDeleted: false, "_id": req.params.categoryId }, { name: 1 });

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFUL, categoryData[0])
    } catch (error) {
      next(error)
    }
  }

  /**
   * This function for update category
   * @param {*} req.params.categoryId 
   * @returns id
   */
  static updateCategory = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkCategoryId = await categoryModel.findOne({ "_id": req.params.categoryId, isDeleted: false })
      if (!checkCategoryId) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.CATEGORY_NOT_FOUND, null)
      }

      const checkCategoryName = await categoryModel.findOne({ "_id": { $ne: req.params.categoryId }, "name": req.body.name, isDeleted: false })
      if (checkCategoryName) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.CATEGORY_ALREADY_EXISTS, null)
      }

      checkCategoryId.name = req.body.name;
      const categoryData = await checkCategoryId.save();

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFULLY_UPDATED, { "_id": categoryData._id })
    }
    catch (error) {
      next(error)
    }
  }

  /**
   * This function for delete category
   * @param {*} req.params.categoryId   
   * @returns null
   */
  static deleteCategory = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkCategoryId = await categoryModel.findOne({ "_id": req.params.categoryId, isDeleted: false })
      if (!checkCategoryId) {
        return send(res, statusCode.NOT_ACCEPTABLE, message.CATEGORY_NOT_FOUND, null)
      }

      checkCategoryId.isDeleted = true;
      const categoryData = await checkCategoryId.save();

      return send(res, statusCode.SUCCESSFUL, message.DELETE_SUCCESS, null)
    } catch (error) {
      next(error)
    }
  }

};

export default categoryController;