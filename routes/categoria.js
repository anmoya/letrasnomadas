const router = require('express').Router();
const Libro     = require('../models/libro');

router.get('/categoria', ( req, res ) => {
    res.render('categoria/index');
});

router.get('/categoria/resultados', async ( req, res ) => {
    let libros = 
        await Libro.find(
            // Condición: que sean de la categoría que pasamos por get
            { categoria : 'Historia' }, 
            (err, foundedBooks) => {
                if (err)
                    console.log(`Tuvimos un error al traer los datos. El error es:\n ${err}`);
                else
                    return foundedBooks;
            });

    res.render('categoria/resultados', { libros : libros });
});

module.exports = router;