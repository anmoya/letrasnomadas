const express = require('express');
const router = express.Router();
const Libro     = require('../models/libro');


router.get('/', function(req, res){
    res.render('landing');
});

router.get('/quienessomos', (req, res) => {
    res.render('index/about');
});

router.get('/mediosentrega', ( req, res ) => {
    res.render('index/entrega');
});

router.get('/faq', ( req, res ) => {
    res.render('index/faq');
});

router.get('/ofertas', (req, res) => {
    Libro.find({ oferta: true }, ( err, foundedBooks ) => {
        if ( err )
            console.log('Tuve un error al traer las ofertas: \n' + err);
        else
            res.send(foundedBooks);
    });
});

module.exports = router;