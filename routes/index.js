const Express = require('express');
const router = Express.Router();
const Libro     = require('../models/libro');
const Resena    = require('../models/resena');
const Utilities = require('../models/utilities');


router.get('/', function(req, res){
    res.render('landing');
});

router.get('/quienessomos', async (req, res) => {
    try {
        const qs = await Utilities.findOne({ type: 'QS' })
        if (qs["title"] == null)
            throw "Ocurrió un error al intentar obtener el recurso. Si esto sigue ocurriendo, contacte con el administrador.";
        return res.render('index/about', { fQS: qs});
    } catch (err) {
        return res.render('error/index', { status: 500, msg: err})
    };
});

router.get('/mediosentrega', async ( req, res ) => {
    try {
        const me = await Utilities.findOne({ type: 'MsE' });
        if (me == null)
            throw "Error: contacte al weon.";
        return res.render('index/entrega', { fME: me });
    } catch (err){
        return res.render('error/index', ({ status: 500, msg: err}));
    }    
});

router.get('/faq', async ( req, res ) => {
    try {
        const faq = await Utilities.find({ type: 'FAQ'});
        if (faq.length < 1)
            throw "Error: contacte al administrador.";
            let sorted = faq;
            sorted.sort((a, b) => {
                if (a["order"] === b["order"])
                    return a["title"] - b["title"];
                else
                    return a["order"] - b["order"];
            });
            res.render('index/faq', { faqs : sorted });
    } catch (err) {
        return res.render('error/index', { status:  500, msg: err });
    }
    
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