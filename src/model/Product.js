import mongoose from 'mongoose'


//Here a schema for a person document is created
const ProductSchema = new mongoose.Schema({
    name: String,
    createdAt: Date,
    description: String,
    price: Number,
    comments: [Object],
    category: String,
    stars: Number
});

//It is possible to declare methods for documents
/*personSchema.methods.age = function() {
    return Math.floor(
        (Date.now()-this.dataOfBirth)/
        (365*24*60*60*1000));
}*/


//The compiled schema is made available to other modules
export default mongoose.model('product', ProductSchema);
