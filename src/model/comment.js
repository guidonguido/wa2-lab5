import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: String,
    body: String,
    stars: Number,
    date: Date
});

//The compiled schema is made available to other modules
const commentModel = mongoose.model('comment', commentSchema);

//TODO do i need to export comment?
//Export che schema in order to be used it the Product schema
export {commentSchema, commentModel};
