const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    colorCode: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    }
})

const Config = mongoose.model('Config', ConfigSchema);

module.exports = { Config }