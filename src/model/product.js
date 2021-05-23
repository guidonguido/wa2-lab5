import mongoose from 'mongoose'
import Comment from './comment.js'

const productCategory = [
    "STYLE",
    "FOOD",
    "TECH",
    "SPORT",
];

/**
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
        required: true,
        min: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    category: {
        type: String,
        required: true,
        enum: productCategory //Checks if the inserted category is in this array
    }
});

/**
 * Personalized Instance method.
 *
 * Retrieve the stars of a product based on the stars of its related comments.
 */
productSchema.methods.stars = async function() {
    //const commentIds = comments.map( (it) => {return mongoose.Types.ObjectId(it)})
    console.log("Comments: " + this.comments)
    const fetchedAvgStars =  await Comment.aggregate([
        {$match: {_id: {$in: this.comments}}},
        {$group: {_id: null, avgStars: {$avg: "$stars"}}}
    ]).project("avgStars").exec()

    return Math.round(fetchedAvgStars[0].avgStars)
}

//The compiled schema is made available to other modules
export default mongoose.model('Product', productSchema);
