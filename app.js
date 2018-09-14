var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose').set('debug',true);
var methodOverride = require('method-override');
var _ = require('underscore');
var data        = require('./data.json');

// require passport, passport-local (estrategia)
var passport = require('passport');
var LocalStrategy = require('passport-local');

// RUTAS
const catalogoRoutes      = require('./routes/catalogo');
const indexRoutes         = require('./routes/index');
const commentRoutes       = require('./routes/comment');
const authorRoutes        = require('./routes/author');



//Modelo User
const User = require('./models/user');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


var uri = `mongodb://${data[0]['USER']}:${data[0]['PASS']}@ds245512.mlab.com:45512/shiloh`;
mongoose.connect(uri);
//mongoose.connect('mongodb://localhost/libreria');



app.use(require('express-session')({
    secret: 's5kNhsi92',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(catalogoRoutes);
app.use(indexRoutes);
app.use(commentRoutes);
app.use(authorRoutes);




app.get('/auth/login', (req, res) => {
    res.render('auth/login');
});

app.post('/auth/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }),
    (req, res) => {
});

app.get('/auth/register', (req, res) => {
    res.render('auth/register');
});

app.listen(
    5001,'localhost', () => console.log('corriendo')
);

