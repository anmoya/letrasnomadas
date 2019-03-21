const express = require('express');
const router = express.Router();
const User = require('../models/user');
// require passport, passport-local (estrategia)
var passport = require('passport');





router.get('/auth/login', (req, res) => {
    res.render('auth/login');
});

router.post('/auth/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }),
    (req, res) => {
});

router.get('/auth/register', (req, res) => {
    res.render('auth/register');
});

router.post('/auth/register', (req, res) => {
    var newUser = new User({ 
        username: req.body.username,
        userrol: req.body.userrol,
        personName: req.body.personName, 
        personLastName: req.body.personLastName, 
        personUrl : req.body.personUrl, 
        personDesc: req.body.personDesc,
        userRol : String
    });
    console.log(newUser);
    User.register(newUser, req.body.password, (err, user) => {
        if (err){
            console.log(err);
            return res.redirect('/auth/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        }
    });
});

module.exports = router;