const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateMovie(genre){
    const schema = Joi.object({
        genre: Joi.string().min(5).max(50).required()
    });
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.valdiateMovie = validateMovie;
exports.genreSchema = genreSchema;