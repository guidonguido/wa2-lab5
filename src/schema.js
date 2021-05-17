import {makeExecutableSchema} from "graphql-tools";

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
        product: (parent, args, context, info) => {
            return {_id: args.id,
                name: "hello",
                createdAt: new Date(),
                description: "Test Product",
                price: 1000,
                stars: 3,
                category: "STYLE"}
        },

        products: (parent, args, context, info) => {
            if( args.sort.value == "price" &&  args.sort.order == "desc")
                return [{
                    _id: args.id,
                    name: "SORTED FILTER",
                    createdAt: new Date(),
                    description: "Test Product",
                    price: 1000,
                    stars: 3,
                    category: "STYLE"
                }]

            else
                return [{
                    _id: args.id,
                    name: "NO SORT NO FILTER",
                    createdAt: new Date(),
                    description: "Test Product",
                    price: 1000,
                    stars: 3,
                    category: "STYLE"
                }]
        }
    },

    Product: {
        comments: (product, args, context, info) => {
            return [{id: 1, product, title: "Good", body:"GG", stars: 3, date: new Date()},
                {id: 2, product, title: "Bad", body:"GG", stars: 4, date: new Date()}]
        }
    },

    Mutation: {
        productCreate: (parent, args, context, info) => {
            console.log(`Product mutation requested ${
                args.productCreateInput.name,
                    args.productCreateInput.description,
                    args.productCreateInput.price,
                    args.productCreateInput.category}`)

            return {_id: 1,
                name: args.productCreateInput.name,
                description: args.productCreateInput.description,
                price: args.productCreateInput.price,
                category: args.productCreateInput.category,
                createdAt: new Date(),
                stars: 3}
        }
    }
}

const schema = makeExecutableSchema({
    typeDefs, resolvers})

export {schema}