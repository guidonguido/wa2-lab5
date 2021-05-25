import Product from "../model/Product.js";
import Comment from "../model/Comment.js";
import {filterSchema} from "graphql-tools";

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
        },

        products: (parent, args, context, info) => {

            return Product.find()
                .then((products) => {

                    const {filter, sort} = args
                    const shouldApplyFilters = filter !== undefined
                    const shouldApplySorting = sort !== undefined

                    console.log(`FILTER: ${shouldApplyFilters}`)

                    shouldApplySorting != false ?
                        console.log(`SORTING: ${shouldApplySorting} - ${sort.value} , ${sort.order}`)
                        :
                        console.log(`SORTING: ${shouldApplySorting}`)


                    if(shouldApplyFilters){
                        const shouldApplyCategoryFilter = filter.categories !== undefined
                        const shouldApplyMinStarsFilter = filter.minStars !== undefined
                        const shouldApplyMinPriceFilter = filter.minPrice !== undefined
                        const shouldApplyMaxPriceFilter = filter.maxPrice !== undefined

                        console.log(`FILTER cat: ${shouldApplyCategoryFilter} - ${filter.categories}`)
                        console.log(`FILTER stars: ${shouldApplyMinStarsFilter} - ${filter.minStars}`)
                        console.log(`FILTER min price: ${shouldApplyMinPriceFilter} - ${filter.minPrice}`)
                        console.log(`FILTER max price: ${shouldApplyMaxPriceFilter} - ${filter.maxPrice}`)

                        if(shouldApplyCategoryFilter)
                            products = products.filter( (p) => filter.categories.includes(p.category) )

                        if(shouldApplyMinPriceFilter)
                            products = products.filter( (p) => p.price >= filter.minPrice )

                        if(shouldApplyMaxPriceFilter)
                            products = products.filter( (p) => p.price <= filter.maxPrice )

                        if(shouldApplyMinStarsFilter)
                            products = products.filter( (p) => p.stars >= filter.minStars)

                        if(shouldApplySorting){

                            if(sort.value == "price"){
                               if(sort.order == "asc")
                                   products = products.sort( (a, b) => a.price - b.price)
                               if(sort.order == "desc")
                                   products = products.sort( (a, b) => b.price - a.price)
                            }
                            if(sort.value == "createdAt"){
                                if(sort.order == "asc")
                                    products = products.sort( (a, b) => new Date(a.createdAt) - new Date(b.createdAt) )
                                if(sort.order == "desc")
                                    products = products.sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt) )
                            }
                        }

                        return products
                    }
                else
                    return products
                }
            )
        }
    },

    Product: {
        comments: (product, args, context, info) => {
            return Comment.find()
                .then( (comments) => {
                    return comments.filter( (c) => product.comments.includes(c._id))
                })
                .catch((err) => {
                    console.error(`ERROR in comment find: ${err}`)
                    throw err
                })
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
                createdAt: new Date(),
                stars: null //-1 ??
            })
            .then((result) =>{
                console.log("Product created on DB")
                console.log(result)
                return result
                //Comment.create({title:args.commentCreateInput, body, stars, date})
            })
            .catch( (err) => {
                console.error("ERROR on productCreate")
                throw err
                }
            )
            return returnValue
        },

        commentCreate: async (parent, args, context, info) => {
            console.log(`Commnent mutation requested`)

            const product2Update = await Product.findById(args.productId).then( (prod) => {return prod})

            if(product2Update) {

                const returnValue = Comment.create({
                    //productId: args.productId,
                    title: args.commentCreateInput.title,
                    body: args.commentCreateInput.body,
                    stars: args.commentCreateInput.stars,
                    date: new Date()
                })
                    .then((commentResult) => {
                        console.log(`Comment for product ${args.productId} created on DB`)
                        console.log(commentResult)

                        //Compute update of stars number on product
                        let newStars = commentResult.stars

                        if(product2Update.comments.length > 0) {
                            /*const oldStarsMean = product2Update.comments.reduce( (acc, comment) => {acc + (comment.stars || 0)}, 0)
                                / product2Update.comments.length*/
                            const oldStarsMean = product2Update.stars

                            console.log(`** STARS old mean: ${oldStarsMean}`)

                            newStars = (oldStarsMean + newStars)/2

                            console.log(`** STARS new mean: ${newStars}`)
                        }

                        return Product.findByIdAndUpdate(args.productId,
                                           {$push: {comments: commentResult._id},
                                                    $set: {stars: newStars}
                                                    },
                                           { new: true, useFindAndModify: false }
                            )
                            .then((productUpdated) => {
                                console.log(`Comment inserted on product ${args.productId}`)
                                console.log(productUpdated)

                                return commentResult
                            })
                            .catch((err) => {
                                    console.error(`ERROR on Update product: ${err}`)
                                    throw err
                                }
                            )
                    })
                    .catch((err) => {
                            console.error(`ERROR on commentCreate: ${err}`)
                            throw err
                        }
                    )
                return returnValue
            }
            else
                return null
        }
    }
}

export default resolvers