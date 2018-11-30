const router = require('express').Router();
const mongoose      = require('mongoose');
const Utilities     = require('../models/utilities');

router.get('/utilities/faq', ( req, res ) => {
    console.log('llegaste');
    res.send('Hola');
});

router.post('/utilities/faq', ( req, res, ) => {
    let type = req.body.type;
    Utilities.find({ type: type.toUpperCase() }, ( err, foundedFAQ ) => {
        if (err) return res.send(err);
        res.send(foundedFAQ);
    });
});

router.post('/utilities/addfaq', (req, res) => {
    let bodyfaq = req.body.faq;
    let faq = new Utilities({
        type: bodyfaq.type,
        title: bodyfaq.title,
        text: bodyfaq.text,
        Subtype: bodyfaq.Subtype,
        order: bodyfaq.order
    });

    Utilities.create(faq, (err, createdFaq) => {
        if (err) 
            console.log(err)
        else {
            console.log("Enviando respuesta.");
            res.send("Faq creado.");
        }
    });
});


module.exports = router;