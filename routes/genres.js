const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre, valdiateMovie} = require('../models/genre');
//const debug = require('debug')('app');

router.post('/', auth, async(req,res) => {
    const { error } = valdiateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let genre = new Genre({ genre: req.body.genre });
    genre = await genre.save();
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req,res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Movie genre does not exist');

    res.send(genre);
});

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

router.put('/:id', auth, async (req,res) => {
    const { error } = valdiateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, { new : true});
    if(!genre) return res.status(404).send('Movie genre does not exist');
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req,res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send('Movie genre does not exist');
    res.send(genre);
});

module.exports = router;