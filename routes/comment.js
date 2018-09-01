var express = require('express');
var router  = express.Router();
var Libro   = require('../models/libro');
var Comment = require('../models/comment');

router.get('/catalogo/:id/comment/new', function(req, res){
    Libro.findById(req.params.id, function(err, foundedBook){
        if (err){
            console.log(err);
        } else {
            res.render('comment/index', { libro: foundedBook });
        }
    });
    
});

router.post('/catalogo/:id/comment', function(req, res){
    Libro.findById(req.params.id, function (err, foundedBook){
        if (err){console.log('Error al encontrar el libro.')}
        else {
            Comment.create(req.body.comment, function(err, commentCreated){
                if (err){
                    console.log('Error al agregar comentario a libro ' + foundedBook.titulo);
                } else {
                    foundedBook.comments.push(commentCreated);
                    foundedBook.save();
                    res.redirect('/catalogo/'+foundedBook._id);
                }
            });
        }
    });
});

module.exports = router;