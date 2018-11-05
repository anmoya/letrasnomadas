
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

router.get('/catalogo/create', isLoggedIn, async (req, res) => {
    let allAuthors = await searchAllAuthors(); // Buscamos los autores
    res.render('catalogo/create', { authors: allAuthors }); // Enviamos a la vista
});

router.get('/catalogo/:page', (req, res) => {
    const porPagina = 8;
    let pagina = req.params.page || 1;

    Libro
        .find({})
        .populate('authors')
        .skip((porPagina * pagina) - porPagina)
        .limit(porPagina)
        .exec((err, allBooks) => {
            if (err) return console.log(err);
            Libro.count().exec((err, count) => {
                if (err)
                    console.log(err);
                else
                    res.render('catalogo/index', {
                        libros: allBooks,
                        current: pagina,
                        pages: Math.ceil(count / porPagina)
                    });
            })

        });
});


/*
** Recibe libro por body y lo inserta en BD
 */
router.post('/catalogo/create', isLoggedIn, (req, res) => {
    // Crea libro en base al request
    let book = createBookObject(req.body, 'create');

    book.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});

/*
** Trae vista de libro por ID 
*/
router.get('/catalogo/show/:id', function (req, res) {
    Libro.findById(req.params.id).populate('comments').populate('authors').populate('resenias').exec(function (err, foundedBook) {
        if (err) {
            console.log('No encontré libro con ese id.');
            console.log('#############################');
            console.log('EROR ' + err);
            console.log('#############################');
        } else {
            /*
            ** Busca libros relacionados primer autor del libro encontrado
             */
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

// Busca libro por ID por post
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



/** Permite editar datos del libro
 * Debe estar logueado
 *  */
router.get('/catalogo/:id/edit', async (req, res) => {
    let authors = await searchAllAuthors();

    Libro.findById(req.params.id).populate('authors').exec(function (err, foundedBook) {
        if (err) {
            console.log('No encontrè el libro.')
            console.log(err);
        } else {
            res.render('./catalogo/edit', {
                libro: foundedBook,
                authors: authors
            });
        }
    });
});

// Actualiza recurso por PUT
router.put('/catalogo/:id/edit', isLoggedIn, async (req, res) => {
    console.log(req.body);
    var id = req.params.id;
    let book = createBookObject(req.body, 'edit');

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
        .catch(err => {
            res.status(500).send({
                message: err
            });
        });
});

/**
 * Delete libro
 * Debe estar logueado
 */
router.delete('/catalogo/:id', isLoggedIn, (req, res) => {
    Libro.findByIdAndRemove(req.params.id, function (err, deletedBook) {
        if (err) {
            console.log('Problema al eliminar.');
        } else {
            res.redirect('/catalogo');
        }
    });
});

/**
 * Métodos 
 */

// BUSCA TODOS LOS AUTORES
let searchAllAuthors = async () => {
    let autores = await Author.find({}, (err, allFoundedAuthors) => {
        if (err)
            console.log(`Error: \n ${err}`);
        else
            return allFoundedAuthors;
    });

    return autores;
}

// CREA OBJETO LIBRO
let createBookObject = (request, method) => {
    if (method === 'create') {
        var book = new Libro({
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
            precioOferta: request.precioOferta,
            destacado: request.destacado,
            oferta: request.oferta
        });
    }
    if (method === 'edit') {
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
            precioOferta: request.precioOferta,
            destacado: request.destacado,
            oferta: request.oferta
        };
    }


    return book;
}



module.exports = router;