import Product from "../model/Product.js";
import Comment from "../model/Comment.js";

const resolvers = {
    Query: {
        product: (parent, args, context, info) => {

            return Product.findById(args.id)
                .then((result)=>{
                    console.log(`Product ${args.id} found`)
                    console.log(result)
                    return result
                })
                .catch((err)=>{
                    console.error(`ERROR by finding product ${args.id}: ${err}`)
                    return err
                })

            /*return {_id: args.id,
                name: "hello",
                createdAt: new Date(),
                description: "Test Product",
                price: 1000,
                stars: 3,
                category: "STYLE"}*/
        },

        products: (parent, args, context, info) => {

            return Product.find()
                .then((result)=>{
                    console.log(`Products found`)
                    console.log(result)
                    return result
                })
                .catch((err)=>{
                    console.error(`ERROR by finding all products: ${err}`)
                    return err
                })

            /*if( args.sort.value == "price" &&  args.sort.order == "desc")
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
                }]*/
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
            console.log(`Product mutation requested
                        ${args.productCreateInput.description},
                        ${args.productCreateInput.name},
                        ${args.productCreateInput.price},
                        ${args.productCreateInput.category}`)

            const returnValue = Product.create({name: args.productCreateInput.name,
                price: args.productCreateInput.price,
                category: args.productCreateInput.category,
                description: args.productCreateInput.description,
                createdAt: new Date()
                /*comments: Comment.create(args.commentCreateInput
                                            .map( it => {
                                                return {title: it.title,
                                                        body: it.body,
                                                        stars: it.stars,
                                                        date: new Date()}
                                                        }
                                                )
                                        )*/
            })
            .then((result) =>{
                console.log("Product created on DB")
                console.log(result)
                console.log(`PRODUCT's PARENT: ${parent}`)
                return result
                //Comment.create({title:args.commentCreateInput, body, stars, date})
            })
            .catch(() => {
                console.error("ERROR on productCreate")
                return null
                }
            )
            return returnValue
        },

        commentCreate: (parent, args, context, info) => {
            console.log(`Commnent mutation requested`)

            if(Product.findById(args.product_id)) {
                const returnValue = Comment.create({
                    product_id: args.product_id,
                    title: args.commentCreateInput.title,
                    body: args.commentCreateInput.body,
                    stars: args.commentCreateInput.stars,
                    date: new Date()
                })
                    .then((result) => {
                        console.log(`Comment for product ${args.product_id} created on DB`)
                        console.log(result)
                        console.log(`COMMENT's PARENT: ${parent}`)
                        return result
                    })
                    .catch((err) => {
                            console.error(`ERROR on commentCreate: ${err}`)
                            return null
                        }
                    )
                return returnValue
            }
            else return null
        }
    }
}

export default resolvers