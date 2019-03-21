const Express           = require('express');
const app               = Express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose').set('debug',true);
const methodOverride    = require('method-override');
const _                 = require('underscore');
const data              = require('./data.json');
const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const User              = require('./models/user');

// RUTAS
const catalogoRoutes        = require('./routes/catalogo');
const indexRoutes           = require('./routes/index');
const commentRoutes         = require('./routes/comment');
const authorRoutes          = require('./routes/author');
const adminRoutes           = require('./routes/admin');
const categoriaRoutes       = require('./routes/categoria');
const utilitiesRoutes       = require('./routes/utilities');
const authRoutes          = require('./routes/auth');

app.use(Express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Autenticación
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

// Middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// DB
var uri = `mongodb://${data[0]['USER']}:${data[0]['PASS']}@ds245512.mlab.com:45512/shiloh`;
mongoose.connect(uri);

// Usa rutas
app.use(catalogoRoutes);
app.use(indexRoutes);
app.use(commentRoutes);
app.use(authorRoutes);
app.use(adminRoutes);
app.use(categoriaRoutes);
app.use(utilitiesRoutes);
app.use(authRoutes);

app.listen(
    process.env.PORT || 5001,
    () => console.log('Working on port 5001')
);



