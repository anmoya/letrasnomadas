const express = require('express');
const router = express.Router();
const Libro     = require('../models/libro');
const Resena    = require('../models/resena');
const Utilities = require('../models/utilities');


router.get('/', function(req, res){
    res.render('landing');
});

router.get('/quienessomos', (req, res) => {
    res.render('index/about');
});

router.get('/mediosentrega', ( req, res ) => {
    Utilities.find({ type: 'ME' }, ( err, foundedUti ) => {
        if (err)
            console.log(err);
        else{
            console.log(foundedUti);
            res.render('index/entrega', {
                fME: foundedUti
            });
        }
        
    });
    
});

router.get('/faq', ( req, res ) => {
    Utilities.find({ type: 'FAQ'}, (err, foundedFAQs) => {
        if (err)
            console.log(err);
        else {
            let sorted = foundedFAQs;
            sorted.sort(function(a, b) {
                if (a["order"] === b["order"])
                    return a["title"] - b["title"];
                else
                    return a["order"] - b["order"];
            });
            res.render('index/faq', { faqs : sorted });
        }
    });

    
});

router.post('/index/libroporid', async (req, res) => {
    let id = req.body.identificador;
    let libro = await Libro.findById(id, ( err, foundedBook ) => {
        if ( err ) return console.log(err);
        return foundedBook;
    });
    res.send(libro);
});

router.post('/index/agregarResenia', async (req, res) => {
    console.log(req.body.obj);
    let obj = req.body.obj;
    let id  = req.body.libro;


    Libro.findById(id, (err, foundedBook) => {
        if (err){console.log('Error al encontrar el libro.')}
        else {
            Resena.create(obj, (err, reseniaCreated) => {
                if (err){
                    console.log('Error al agregar comentario a libro ' + foundedBook.titulo);
                } else {
                    foundedBook.resenias.push(reseniaCreated);
                    foundedBook.save();
                    res.send('Se agregó reseña');
                }
            });
        }
    });    
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