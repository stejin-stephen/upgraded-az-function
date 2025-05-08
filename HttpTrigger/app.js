const path = require('path')
const express = require('express')
const ejs = require('ejs').__express
const app = express()
const router = require('./routes').default

// Set up view engine
app.set('view engine', 'ejs')
app.engine('.ejs', ejs)

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))

// Mount the router
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
