var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose').set('debug',true);
var methodOverride = require('method-override');
var _ = require('underscore');
var data        = require('./data.json');
let Libro = require('./models/libro');

// require passport, passport-local (estrategia)
var passport = require('passport');
var LocalStrategy = require('passport-local');

// RUTAS
const catalogoRoutes        = require('./routes/catalogo');
const indexRoutes           = require('./routes/index');
const commentRoutes         = require('./routes/comment');
const authorRoutes          = require('./routes/author');
const adminRoutes           = require('./routes/admin');
const categoriasRoutes           = require('./routes/categoria');



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
app.use(adminRoutes);
app.use(categoriasRoutes);



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

app.post('/auth/register', (req, res) => {
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

app.get('/adminpanel', (req, res) => {
    res.render('adminpanel/index');
});

app.get('/ofertas', (req, res) => {
    Libro.find({ oferta: true }, ( err, foundedBooks ) => {
        if ( err )
            console.log('Tuve un error al traer las ofertas: \n' + err);
        else
            res.send(foundedBooks);
    });
});


app.listen(
    5001,'localhost', () => console.log('corriendo')
);



