const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    articulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: "default.png"
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
})

const item = mongoose.model('item', itemSchema)

module.exports = item
