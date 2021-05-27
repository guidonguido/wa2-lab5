import mongoose from 'mongoose'
import {commentSchema} from './comment.js'

const productCategory = [
    "STYLE",
    "FOOD",
    "TECH",
    "SPORT",
]

/**
 *
 * Normalizing the comments data:
 * Since comment data is not updated a lot then we consider not referencing (normalizing) it.
 * The database engine does more work to update and embed a document than a standalone document.
 *
 * Each time someone posts a Comment, we need to update the corresponding Product document.
 * The data can change all the time, so this is a great candidate for referencing.
 *
 * Also, in Mongo, one document should contain maximum of 16MB, not more than that.
 *
 * We are programming to have a small number of comments (less than 1k per product),
 * so we decided to embed it.
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min:0
    },
    comments: [commentSchema],
    category: {
        type: String,
        required: true,
        enum: productCategory
    },
    stars: {
        type: Number,
        min: 0,
        max: 5
    }
})


//The compiled schema is made available to other modules
export default mongoose.model('Product', productSchema)
