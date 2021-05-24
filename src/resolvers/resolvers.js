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
                .then((products) => {

                    const {filter, sort} = args
                    const shouldApplyFilters = filter !== undefined
                    const shouldApplySorting = sort !== undefined

                    console.log(`FILTER: ${shouldApplyFilters}`)
                    console.log(`SORTING: ${shouldApplySorting} - ${sort.value} , ${sort.order}`)


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


            /*return Product.find(filterInput)
                .then((result)=>{
                    console.log(`Products found`)
                    console.log(result)
                    return result
                })
                .catch((err)=>{
                    console.error(`ERROR by finding all products: ${err}`)
                    return err
                })*/

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