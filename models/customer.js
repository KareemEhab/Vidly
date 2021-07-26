const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: String
}));

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        isGold: Joi.bool(),
        phone: Joi.string()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;