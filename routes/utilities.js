const router = require('express').Router();
const Utilities = require('../models/utilities');

// Devuelve todas las utilidades de un tipo
router.get('/utilities/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    Utilities.find({ type: tipo.toUpperCase() }, (err, allFounded) => {
        if (err)
            return err;
        else
            res.json(allFounded);
    })
});

// Devuelve utilidad por tipo e id
router.get('/utilities/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    Utilities.find({ _id: id, type: tipo.toUpperCase() }, (err, allFounded) => {
        if (err)
            return err;
        else
            res.json(allFounded);
    })
});

// Agrega utilidades
router.post('/utilities', (req, res) => {
    let bodyUtilidad = req.body.utilidad;

    let utilidad = new Utilities({
        type : bodyUtilidad.type,
        title: bodyUtilidad.title,
        text : bodyUtilidad.text,
        Subtype: bodyUtilidad.Subtype,
        order: bodyUtilidad.order
    });

    Utilities.create(utilidad, (err, createdUti) => {
        if (err) {
            res.json({
                status: 'Error',
                message: `Hubo un error al crear ${createdUti.title}.`,
                obj: err
            })
        }
        else {
            res.json({
                status: 'OK',
                message: `${createdUti.title} fue creado con exito.`,
                obj: createdUti
            })
        }
    });
});

// Actualiza utilidad: debe llegar el id y los campos titulo, texto. Orden, si se usa.
router.put('/utilities', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const utiBody = req.body.utilidad;
    
    Utilities.findByIdAndUpdate(
        id,
        { title: utiBody.title, text: utiBody.text, order: utiBody.order },
        (err, updatedUti) => {
            if (err) {
                res.json({
                    status: 'Error',
                    message: `Hubo un error al updatear la utilidad.`,
                    obj: err
                })
            }
            else {
                res.json({
                    status: 'OK',
                    message: `${updatedUti.title} fue actualizada con exito.`,
                    obj: updatedUti
                })
            }
        }
    )
})

// Elimina con ID
router.delete('/utilities', (req, res) => {
    const id = req.body.id;
    Utilities.findByIdAndDelete(id, (err, deletedUti) => {
        if (err) {
            res.json({
                status: 'Error',
                message: `Hubo un error al eliminar la utilidad.`,
                obj: err
            })
        }
        else {
            res.json({
                status: 'OK',
                message: `${deletedUti.title} fue eliminado con exito.`,
                obj: deletedUti
            })
        }
    });
})


module.exports = router;