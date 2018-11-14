const express = require('express');
const router = express.Router();

const moment = require('moment');
const Libro  = require('../models/libro');
const Author = require('../models/author');


router.get('/author', (req, res) => {
    Author.find({}, (err, allFoundedAuthors) => {
        if ( err ) {
            console.log('No me fue posible traer los autores desde la base de datos.')
        } else {
            res.render('author/index', { allAuthors : allFoundedAuthors, moment : moment });
        }
    });
});


router.get('/author/create', (req, res) => {
    res.render('author/create');
});

router.post('/author/create', (req, res) => {
    console.log(req.body.author);
    Author.create(req.body.author, (err, createdAuthor) => {
        if (err) {
            console.log('No pude crear el autor');
        } else {
            res.redirect('/author');
        }
    });
});


router.get('/author/:id', (req, res) => {
    Author.findById(req.params.id, (err, foundedAuthor) => {
        if ( err ){
            console.log('No me fue posible encontrar un author con el id ' + req.params.id);
        } else {
            res.render( 'author/show', { author: foundedAuthor } );
        }
    });
});

router.delete('/author/:id', (req, res) => {
    Author.findByIdAndRemove(req.params.id, (err, deletedAuthor) => {
        if ( err )
            console.log(`Problems in order to delete ${deletedAuthor._id}: ${err} `);
        else
            res.redirect('/author');
    });
});

router.get('/author/:id/edit', (req, res) => {
    Author.findById(req.params.id, (err, foundedAuthor) => {
        if (err) {
            console.log(`Tuve problemas para encontrar el id ${req.params.id} en la base de datos.`);
        } else {
            res.render('author/edit', { author : foundedAuthor });
        }
    });
});

router.put('/author/:id/edit', (req, res) => {
    Author.findByIdAndUpdate(req.params.id, req.body.author, (err, updatedAuthor) => {
        if (err){
            console.log('Tuve problemas a la hora de updatear ' + req.params.id);
        } else {
            res.redirect(`/author/${updatedAuthor._id}`);
        }
    });
});

// obtener los libros del autor.
router.get('/author/:id/obtain', async ( req, res ) => {
    let id = req.params.id;
    let libros = await Libro.find({ authors: id}, ( err , foundedBooks ) => {
        return foundedBooks;
    });
    console.log('###########################');
    console.log(libros);
});




module.exports = router;