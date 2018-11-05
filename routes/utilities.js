const router = require('express').Router();
const mongoose      = require('mongoose');
const Utilities     = require('../models/utilities');

router.get('/utilities/faq', ( req, res ) => {
    console.log('llegaste');
    res.send('Hola');
});

router.post('/utilities/faq', ( req, res, ) => {
    Utilities.find({}, ( req, res ) => {
        
    });
});



module.exports = router;