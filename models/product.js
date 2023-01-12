import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      require: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      trim: true,
    },

    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
