const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');

router.get('/', async (req, res) => {
    const genres = await Customer.find().sort('name');
    res.send(genres);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    try{
        customer = await customer.save();
    }catch(ex){
        res.send(ex.message);
    }
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name,
        isGold: req.body.isGold == 'true',
        phone: req.body.phone }, { new: true });
    if(!customer) return res.status(404).send('Customer by that ID was not found');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send('Customer by that ID was not found');
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Customer by that ID was not found');
    res.send(customer);
});

module.exports = router;