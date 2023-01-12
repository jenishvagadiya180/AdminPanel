import mongoose from "mongoose";
const { Schema } = mongoose;


const imageSchema = new mongoose.Schema({

    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },

    image: {
        type: String,
        required: true,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: Number,
    updatedAt: Number

},
    { timestamps: true });

const imageModel = mongoose.model("image", imageSchema);


export default imageModel;