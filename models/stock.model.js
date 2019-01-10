const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StockSchema = new Schema({
    date: {type: Date, required: true},
    symbol: {type: String, required: true},
    open: {type: Number, required: true},
    close: {type: Number, required: true},
    low: {type: Number, required: true},
    high: {type: Number, required: true},
    volume: {type: Number, required: true}
});

module.exports = mongoose.model('Stock', StockSchema);
