import mongoose from 'mongoose'
import {commentSchema} from './comment.js'

//TODO is it correct?
const productCategory = [
    "STYLE",
    "FOOD",
    "TECH",
    "SPORT",
];

//Here a schema for a person document is created
const productSchema = new mongoose.Schema({
    name: String,
    createdAt: Date,
    description: String,
    price: {
        type: Number,
        min: 0
    },
    comments: [commentSchema], //I could store ObjectId instead, to keep the document size below 16MB, but in this way it shouldn't surpass it
    category: {
        type: String,
        enum: productCategory
    },
    stars: {
        type: Number,
        min: 1,
        max: 5
    }
});


//The compiled schema is made available to other modules
const productModel = mongoose.model('product', productSchema);

export default productModel
