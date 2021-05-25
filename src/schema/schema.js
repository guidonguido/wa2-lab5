import {makeExecutableSchema} from 'graphql-tools'
import Product from '../model/Product.js'
import Comment from '../model/Comment.js'

const typeDefs = `
    scalar DateTime,
    
    enum ProductCategory {
        STYLE
        FOOD
        TECH
        SPORT
    },
    
    enum SortingValue {
        createdAt
        price
    },
    
    enum SortingOrder {
        asc
        desc
    },
    
    input ProductCreateInput {
        name : String!,
        description : String,
        price : Float!,
        category: ProductCategory!
    },
    
    input CommentCreateInput {
        title: String!,
        body: String,
        stars: Int!
    }
    
    type Comment {
        _id: ID!,
        title: String!,
        body: String,
        stars: Int!,
        date: DateTime!
    },
    
    type Product {
        _id: ID!,
        name: String!,
        createdAt: DateTime!,
        description: String,
        price: Float!,
        comments (last: Int) : [Comment],
        category: ProductCategory!,
        stars: Float
    },
    
    input ProductFilterInput {
        categories: [ProductCategory],
        minStars: Int,
        minPrice: Float,
        maxPrice: Float
    },
    
    input ProductSortInput {
        value: SortingValue!,
        order: SortingOrder!
    },
    
    type Query {
        products (filter: ProductFilterInput, sort: ProductSortInput) : [Product],
        product (id: ID!) : Product,
    },
    
    type Mutation {
        productCreate (productCreateInput: ProductCreateInput!) : Product,
        commentCreate (
            commentCreateInput: CommentCreateInput!,
            productId: ID!
        ) : Comment
    }
`

const resolvers = {
    Query: {
        product: async (parent, args, context, info) => {
            try{
                const fetchedProduct = await Product.findById(args.id).exec()

                return fetchedProduct
        } catch( error ) {
            throw error
        }},

        products: async (parent, args, context, info) => {

            try{
                const filter = {
                    categories: (args.filter && args.filter.categories) || null,
                    minStars: (args.filter && args.filter.minStars)|| null,
                    minPrice: (args.filter && args.filter.minPrice)|| null,
                    maxPrice: (args.filter && args.filter.maxPrice)|| null
                }

                const sort = {
                    value: (args.sort && args.sort.value)|| null,
                    order: (args.sort && args.sort.order)|| null
                }


                // Initialize pipeline with firs filters
                let productsPipeline = Product.aggregate([
                    { $match: {
                        $and: [
                            //{stars: {$gt: args.filter.minStars || 0}},
                            {price: {$gt: filter.minPrice || 0,
                                     $lt: filter.maxPrice || Number.MAX_SAFE_INTEGER}},
                        ]}}
                ])

                // PARAMETRIC FILTERS
                // - If filtering categories are specified
                filter.categories && productsPipeline.match({ category: {$in: filter.categories}})

                // - If sorting value is specified
                sort.value && productsPipeline.sort(
                    `${sort.order.toString()=='asc'? "" : "-"}${sort.value.toString()}`)

                console.log("Applied pipeline: ")
                console.log(productsPipeline.pipeline())

                const fetchedProducts = await productsPipeline.exec()

                //console.log(fetchedProducts)

                // Populate stars field and filter by minStars
                const productsWithStars = fetchedProducts.map( async (product) =>{
                    const productModel = new Product( {... product})
                    const stars = await productModel.stars()
                    if( filter.minStars && stars > filter.minStars ) {
                        productModel.stars = stars
                        return productModel
                    }
                    if( !filter.minStars )
                       return productModel
                })

                return Promise.all(productsWithStars).then((values) => {
                    return values.filter( it => it != null)})
            } catch( error ) {
                throw error
            }


    }},

    Product: {
        comments: async (product, args, context, info) => {
            const fetchedComments = await Comment.find({
                '_id': { $in: product.comments
                } }).exec()
            return fetchedComments
        }
    },

    Mutation: {
        productCreate: async (parent, args, context, info) => {
            try {
                const { name, description, price, category } = args.productCreateInput
                const product = new Product({
                    name: name,
                    createdAt: new Date(),
                    description: description,
                    price: price,
                    // comments: null, // Comments _id list
                    category: category,
                    stars: 0 // New products starts from 0 stars
                })

                const newProduct = await Product.create(product)
                console.log("Created product: " +newProduct)
                return newProduct
            }catch (error) {
                console.log("Error on mutation")
                throw error
            }
        },

        commentCreate: async (parent, args, context, info) => {
            try {
                const { title, body, stars} = args.commentCreateInput
                const productID = args.productId
                const comment = new Comment({
                    title: title,
                    body: body,
                    stars: stars,
                    date: new Date()
                })

                const newComment = await Comment.create(comment)
                console.log("Created comment: " +newComment)

                // Update the referenced comments on Product
                await Product.findByIdAndUpdate(
                    productID,
                    {$push: {comments: newComment._id}},
                    { new: true, useFindAndModify: false })

                return newComment
            }catch (error) {
                console.log("Error on mutation")
                throw error
            }
        }

    }
}

const schema = makeExecutableSchema({
    typeDefs, resolvers})

export default schema