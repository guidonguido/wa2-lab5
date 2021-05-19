import mongoose from 'mongoose'
import Comment from './Comment.js'

//TODO Unused, remove itgra
const ProductCategory = {
    STYLE: "STYLE",
    FOOD: "FOOD",
    TECH: "TECH",
    SPORT: "SPORT",
}

/**
 * @type {module:mongoose.Schema<Document, Model<any, any, any>, undefined>}
 *
 * Normalizing the comments data:
 * Since comment data is updated a lot then we consider referencing (normalizing) it.
 * That’s because the database engine does more work to update and embed a document than a standalone document.
 *
 * Each time someone posts a Comment, we need to update the corresponding Product document.
 * The data can change all the time, so this is a great candidate for referencing.
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
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    category: {
        type: String,
        required: true
    },
    // TODO change this upon comments stars
    stars: Number
});

//It is possible to declare methods for documetns
/*personSchema.methods.age = function() {
    return Math.floor(
        (Date.now()-this.dataOfBirth)/
        (365*24*60*60*1000));
}*/


//The compiled schema is made available to other modules
export default mongoose.model('Product', productSchema)
