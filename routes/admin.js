var express = require('express');
var router = express.Router();
var Libro = require('../models/libro');
var moment = require('moment');


router.get('/admin/ofertas', async (req, res) => {
    let foundedBooks = await Libro.find({}, async ( err, allFoundedBook ) => {
        if (err){console.log('Error al encontrar el libro.')}
        else {
            return allFoundedBook;
        }
    });
    res.send(foundedBooks);
});

router.get('/admin/destacado', async (req, res) => {
    let foundedBooks = await Libro.find({ destacado : true }, async ( err, allFoundedBook ) => {
        if (err){console.log('Error al encontrar el libro.')}
        else {
            return allFoundedBook;
        }
    });
    res.send(foundedBooks);
});

router.put('/admin/ofertas/quitar', async (req, res) => {
    console.log(req.body);
    Libro.findByIdAndUpdate( req.body.id, { oferta : false }, ( err, updatedBook ) => {
        if ( err )
            console.log('Hubo un error al quitar la oferta: \n' +  err);
        else
            res.send(true);
    });
});


module.exports = router;