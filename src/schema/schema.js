//import {makeExecutableSchema} from 'graphql-tools'
import pkg from 'graphql-tools';
const {makeExecutableSchema} = pkg;
import mongoose from 'mongoose'
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
mongoose.set('useFindAndModify', false);

const resolvers = {
    Query: {
        product: async (parent, args, context, info) => {
            const res = await Product.findById(args.id)
            return {
                _id: res.id,
                name: res.name,
                createdAt: res.createdAt,
                description: res.description,
                comments: res.comments,
                price: res.price,
                stars: res.stars,
                category: res.category
            }
        },

        products: async (parent, args, context, info) => {
            const order = args.sort.order === "desc" ? "-"+args.sort.value : args.sort.value
            const minFilterStars = args.filter.minStars ? args.filter.minStars : 0
            const minFilterPrice = args.filter.minPrice ? args.filter.minPrice : 0
            const maxFilterPrice = args.filter.maxPrice ? args.filter.maxPrice : Number.MAX_SAFE_INTEGER
            let res
            if (args.filter.categories)
                res = await Product.find({category: { $in: args.filter.categories },stars: { $gte: minFilterStars}, price: { $gte: minFilterPrice,  $lte: maxFilterPrice}}).sort(order);
            else
                res = await Product.find({stars: { $gte: minFilterStars}, price: { $gte: minFilterPrice,  $lte: maxFilterPrice}}).sort(order);
            return res
        }
    },

    /*Product: {
        comments: (product, args, context, info) => {
            return product.comments
        }
    },*/

    Mutation: {
        productCreate: async (parent, args, context, info) => {
            const newProduct = new Product({
                name: args.productCreateInput.name,
                description: args.productCreateInput.description,
                price: args.productCreateInput.price,
                category: args.productCreateInput.category,
                createdAt: new Date(),
                stars: 0
            });
            try {
                await newProduct.save();
                return newProduct
            } catch (e) {
                console.log("Error in productCreate")
                throw e
            }

        },

        commentCreate : async (parent, args, context, info) => {
            const newComment = new Comment({
                title: args.commentCreateInput.title,
                body: args.commentCreateInput.body,
                stars: args.commentCreateInput.stars,
                date: new Date()
            });
            try {
                //await newComment.save();
                const prod = await Product.findById(args.productId)
                const newStars = ((prod.stars * prod.comments.length) + args.commentCreateInput.stars)/(prod.comments.length+1)
                await Product.findOneAndUpdate(
                    { _id: args.productId },
                    { $push: { comments: newComment  },
                             $set:  { stars: newStars}})
                return newComment
            } catch (e) {
                console.log("Error in productCreate")
                throw e
            }

        }
    }
}

const schema = makeExecutableSchema({
    typeDefs, resolvers})

export {schema}