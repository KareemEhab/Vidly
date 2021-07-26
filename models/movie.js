const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
}));

function validateMovie(genre){
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genreId: Joi.objectID().required,
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    });
    return schema.validate(genre);
}

exports.Movie = Movie;
exports.validate = validateMovie;