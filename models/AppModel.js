const mongoose = require('mongoose')
const appSchema = new mongoose.Schema({
    name: String,
    path: String,
    param: String,
    icon: String
});

module.exports = mongoose.model('App', appSchema);
