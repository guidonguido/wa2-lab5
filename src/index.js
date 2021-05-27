'use strict'

import express from 'express'
import morgan from "morgan"

import {graphqlHTTP} from "express-graphql";

//GraphQL Schema
import schema from "./schema/schema.js"
import connection from "./utils/connection.js"


const app = express()
app.use(morgan('dev'))

app.use("/graphql", graphqlHTTP({
        schema: schema,
        graphiql: true
    }
))

connection()
    .then(() => {
        app.listen(3000, () => { console.log("Server running on port 3000")})
    })
    .catch(() => {
        console.log("Server stopped due to a DB connection error")
        process.exit(1);
    })
