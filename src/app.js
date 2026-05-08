require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const app = express()
const PORT = process.env.PORT || 4000

// db cn

mongoose.connect(process.env.DB_URI)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('conectado a la db'))


//middleware

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(session({
    secret: 'jj',
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    next()
})

app.use(express.static('public'))
app.use(express.static('upload'))

//configurar plantillas

app.set('view engine', 'ejs')

app.use('/', require('../routers/auth-routes'));
app.use('/', require('../routers/product-routes'));

app.listen(PORT, () => {
    console.log(`servidor iniciado en http://localhost:${PORT}`)
})