
const express = require('express');
const router = express.Router();
/*  ################ 
        MODELOS 
    ################ */
const Libro = require('../models/libro');
const Author = require('../models/author');


/*  #################### 
        SABER SI
        ESTÁ LOGUEADO
    #################### */
let isLoggedIn = (req, res, next) => {
    // Si esta logueado, next
    if (req.isAuthenticated()) {
        return next();
    }
    // si no, redirigimos
    res.send('no autorizado');
};

router.get('/catalogo', (req, res) => {
    console.log('Buscando libros: ');
    let libros = Libro.find({}).populate('authors').exec(function (err, allBooks) {
        if (err)
            console.log(`Error:\n${err}\n#####################`);
        else {
            res.render('catalogo/index', { libros: allBooks });
        }
    });
});

router.get('/catalogo/create', isLoggedIn, async (req, res) => {
    let allAuthors = await searchAllAuthors(); // Buscamos los autores
    res.render('catalogo/create', { authors: allAuthors }); // Enviamos a la vista
});



router.post('/catalogo/create', isLoggedIn, (req, res) => {
    console.log(req.body.authors);
    // Crea libro en base al request
    let book = createBookObject(req.body);

    if (book.nuevo == 'on') {
        book.nuevo = true;
    } else {
        book.nuevo = false;
    }

    console.log('##############');
    console.log(book.destacado);

    book.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
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
                    _id: foundedBook.authors[0]
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
    }).then(() => {
        res.send(foundedBook);
    }).catch(err => {
        res.status(500).send({
            message: 'Libro no encontrado'
        })
    });
});


router.put('/catalogo/:id/edit',  async (req, res) => {

    var id = req.params.id;
    let book = createBookObject(req.body);


    if (book.nuevo == 'on') {
        book.nuevo = true;
    } else {
        book.nuevo = false;
    }

    await Libro.findByIdAndUpdate(id, book, async (err, updatedBook) => {
        if (err) {
            console.log(err);
        } else {
            return updatedBook;
        }
    })
    .then(data => { 
        res.send(data);
    })
    .then( data => JSON.stringify(data))
    .catch(err => {
            res.status(500).send({
                message: err
            });
        });
});

router.delete('/catalogo/:id', isLoggedIn, function (req, res) {
    Libro.findByIdAndRemove(req.params.id, function (err, deletedBook) {
        if (err) {
            console.log('Problema al eliminar.');
        } else {
            res.redirect('/catalogo');
        }
    });
});

// EDIT
router.get('/catalogo/:id/edit',  function (req, res) {
    Libro.findById(req.params.id).populate('authors').exec(function (err, foundedBook) {
        if (err) {
            console.log('No encontrè el libro.')
            console.log(err);
        } else {
            Author.find({}, function (err, allFoundedAuthors) {
                if (err) {
                    console.log('No pude encontrar a los autores.')
                } else {
                    console.log(foundedBook);
                    res.render('./catalogo/edit', { libro: foundedBook, authors: allFoundedAuthors });
                }
            });

        }
    })

});


/**
 * Métodos 
 */

// BUSCA TODOS LOS AUTORES
let searchAllAuthors = async () => {
    let autores = await Author.find({}, (err, allFoundedAuthors) => {
        if
        (err) console.log(`Error: \n ${err}`);
        else
            return allFoundedAuthors;
    });

    return autores;
}

// CREA OBJETO LIBRO
let createBookObject = (request) => {
    var book = {
        titulo: request.tituloLibro,
        subtitulo: request.subtituloLibro,
        nuevo: request.nuevo,
        anioPublicacion: request.anioPublicacion,
        pais: request.pais,
        ciudad: request.ciudad,
        editorial: request.editorial,
        img: request.img,
        authors: request.authors,
        descripcion: request.descripcion,
        stock: request.stock,
        nuevo: request.nuevo,
        categoria: request.categoria,
        temas: request.temas,
        keywords: request.keywords,
        precio: request.precio,
        destacado: request.destacado
    };

    return book;
}

module.exports = router;