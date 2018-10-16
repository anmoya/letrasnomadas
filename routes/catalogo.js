var express = require('express');
var router = express.Router();
var Libro = require('../models/libro');
const Author = require('../models/author');


router.get('/catalogo', function (req, res) {
    Libro.find({}).populate('authors').exec(function (err, allBooks) {
        if (err) {
            console.log('No pude encontrar libros en la base de datos.');
        } else {
            res.render('catalogo/index', { libros: allBooks });
        }
    });
});

router.get('/catalogo/create', isLoggedIn, function (req, res) {
    Author.find({}, (err, allFoundedAuthors) => {
        if (err){ 
            console.log('Tuve problemas para encontrar los autores.')
            console.log(err);
        }
        else {
            res.render('catalogo/create', { authors : allFoundedAuthors });
        }
    });
    
});

router.post('/catalogo/create', isLoggedIn, function (req, res) {
    console.log(req.body.authors);
    var book = new Libro({
        titulo          :   req.body.tituloLibro,
        subtitulo       :   req.body.subtituloLibro,
        nuevo           :   req.body.nuevo,
        anioPublicacion :   req.body.anioPublicacion,
        pais            :   req.body.pais,
        ciudad          :   req.body.ciudad,
        editorial       :   req.body.editorial,
        img             :   req.body.img,
        authors         :   req.body.authors,
        descripcion     :   req.body.descripcion,
        stock           :   req.body.stock,
        nuevo           :   req.body.nuevo,
        categoria       :   req.body.categoria,
        temas           :   req.body.temas,
        keywords        :   req.body.keywords,
        precio          :   req.body.precio,
        destacado       :   req.body.destacado
    });
    
    if (book.nuevo == 'on') {
        book.nuevo = true;
    } else {
        book.nuevo = false;
    }

    console.log('##############');
    console.log(book.destacado);
    
    book.save()
    .then(data => { res.send(data);
    }).catch( err => {
        res.status(500).send({
            message: err.message
        });
    });
});

router.get('/catalogo/:id', function (req, res) {
    Libro.findById(req.params.id).populate('comments').populate('authors').exec(function (err, foundedBook) {
        if (err) {
            console.log('No encontré libro con ese id.');
            console.log('#############################');
            console.log('EROR ' + err);
            console.log('#############################');
        } else {
            // ############################
            // BUSCA LIBROS DEL MISMO AUTOR
            // ############################
            Libro.find(
                {
                    _id:  foundedBook.authors[0]
                },
                function (err, foundedSameAuthor) {
                    if (err) {
                        console.log('Me caí buscando otros libros del mismo autor.')
                    } else {
                        console.log('Libro encontrado: ' + foundedBook['titulo'] + '\nEnviado a la catalogo/show');
                        res.render('catalogo/show', { libro: foundedBook, sameAuthor: foundedSameAuthor });
                    }
                }
            );
        }
    });
});

router.post('/catalogo/buscalibroporid', (req, res) => {
    console.log('Llegaste');
    console.log(req.body.id);
    Libro.findById(req.body.id, (err, foundedBook) => {
        if (err) console.log(`Error al buscar el libro: ${err}`);
    }).then( () => {res.send(foundedBook);
    }).catch( err => {
        res.status(500).send({
            message : 'Libro no encontrado'
        })
    });
});


router.put('/catalogo/:id/edit', async function (req, res) {
    
    var id = req.params.id;
    //console.log(id);
    var book = {
        titulo          :   req.body.tituloLibro,
        subtitulo       :   req.body.subtituloLibro,
        nuevo           :   req.body.nuevo,
        anioPublicacion :   req.body.anioPublicacion,
        pais            :   req.body.pais,
        ciudad          :   req.body.ciudad,
        editorial       :   req.body.editorial,
        img             :   req.body.img,
        authors         :   req.body.authors,
        descripcion     :   req.body.descripcion,
        stock           :   req.body.stock,
        nuevo           :   req.body.nuevo,
        categoria       :   req.body.categoria,
        temas           :   req.body.temas,
        keywords        :   req.body.keywords,
        precio          :   req.body.precio,
        destacado       :   req.body.destacado
    };
    
    if (book.nuevo == 'on'){
        book.nuevo = true;
    } else {
        book.nuevo = false;
    }

    await Libro.findByIdAndUpdate(id, book, function(err, updatedBook){
        console.log('Libro antes de updatear.#######################');
        console.log(book);
        if (err) {
            console.log(err);
        }
        console.log('Libro updateado##########################.');
        console.log(book);
    }).then(data => res.send(data))
    .catch( err => {
        res.status(500).send({
            message: 'hola'
        });
    });
});

router.delete('/catalogo/:id', function (req, res) {
    Libro.findByIdAndRemove(req.params.id, function (err, deletedBook) {
        if (err) {
            console.log('Problema al eliminar.');
        } else {
            res.redirect('/catalogo');
        }
    });
});

// EDIT
router.get('/catalogo/:id/edit', function (req, res) {
    Libro.findById(req.params.id).populate('authors').exec(function (err, foundedBook) {
        if (err) {
            console.log('No encontrè el libro.')
            console.log(err);
        } else {
            Author.find({}, function( err, allFoundedAuthors){
                if (err){
                    console.log('No pude encontrar a los autores.')
                }   else {
                    console.log(foundedBook);
                    res.render('./catalogo/edit', { libro: foundedBook, authors : allFoundedAuthors });
                }
            });
            
        }
    })

});

function isLoggedIn(req, res, next){
    // Si esta logueado, next
    if (req.isAuthenticated()){
        return next();
        }
        // si no, redirigimos
        res.send('no autorizado');
};

module.exports = router;