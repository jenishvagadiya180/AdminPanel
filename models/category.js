import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    },

    createdAt: Number,
    updatedAt: Number

},

    { timestamps: true });

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;