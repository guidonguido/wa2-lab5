import mongoose from 'mongoose'
import Comment from './Comment.js'

//TODO Unused, remove itgra
const ProductCategory = {
    STYLE: "STYLE",
    FOOD: "FOOD",
    TECH: "TECH",
    SPORT: "SPORT",
}

//Here a schema for a person document is created
const productSchema = new mongoose.Schema({
    name: String,
    createdAt: Date,
    description: String,
    price: Number,
    //TODO Is it correct? How do we link Comment?
    comments: [Number],
    category: String,
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
