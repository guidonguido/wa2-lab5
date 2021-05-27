import Product from "../model/product.js";
import {Comment} from "../model/comment.js";

const resolvers = {
    Query: {
        product: async (parent, args) => {
            try{
                return await Product.findById(args.id).exec()
            } catch( error ) {
                throw error
            }},

        products: async (parent, args) => {
            try{
                const filter = {
                    categories: (args.filter && args.filter.categories) || null,
                    minStars: (args.filter && args.filter.minStars) || 0,
                    minPrice: (args.filter && args.filter.minPrice) || 0,
                    maxPrice: (args.filter && args.filter.maxPrice) || Number.MAX_SAFE_INTEGER
                }

                const sort = {
                    value: (args.sort && args.sort.value) || null,
                    order: (args.sort && args.sort.order) || null
                }


                // Initialize pipeline with first filters
                let productsPipeline = Product.aggregate([
                    { $match: {
                            $and: [
                                { stars: { $gte: filter.minStars}},
                                { price: { $gte: filter.minPrice,
                                           $lte: filter.maxPrice}},
                            ]}}
                ])

                // PARAMETRIC FILTERS
                // - If filtering categories are specified
                filter.categories && productsPipeline.match({ category: { $in: filter.categories}})

                // - If sorting value is specified
                sort.value && productsPipeline.sort(
                    `${sort.order.toString()==='asc'? "" : "-"}${sort.value.toString()}`)

                console.log("Applied pipeline: ")
                console.log(productsPipeline.pipeline())

                return await productsPipeline.exec()
            } catch( error ) {
                throw error
            }
        }},

    Product: {
        stars: (product) => {
            return Math.round(product.stars * 10) / 10
        }
    },

    Mutation: {
        productCreate: async (parent, args) => {
            try {
                const { name, description, price, category } = args.productCreateInput
                const product = new Product({
                    name: name,
                    createdAt: new Date(),
                    description: description,
                    price: price,
                    category: category,
                    stars: 0 // New products starts from 0 stars
                })

                return await product.save()
            } catch (error) {
                console.log("Error on mutation")
                throw error
            }
        },

        commentCreate: async (parent, args) => {
            try {
                const { title, body, stars} = args.commentCreateInput
                const productID = args.productId

                const product = await Product.findById(productID)

                const comment = new Comment({
                    title: title,
                    body: body,
                    stars: stars,
                    date: new Date()
                })

                const validationError = comment.validateSync()

                if (validationError != null)
                    throw new Error(validationError.name)

                const updatedStars = ((product.stars * product.comments.length) + stars)/(product.comments.length+1)

                // Update the referenced comments and stars on Product
                await Product.findByIdAndUpdate(
                    productID,
                    {$push: {comments: comment},
                            $set: {stars: updatedStars}},
                    { useFindAndModify: false })

                return comment
            } catch (error) {
                console.log("Error on mutation")
                throw error
            }
        }
    }
}

export default resolvers
