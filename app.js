var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose').set('debug',true);
var methodOverride = require('method-override');
var _ = require('underscore');
var data        = require('./data.json');

var uri = `mongodb://${data[0]['USER']}:${data[0]['PASS']}@ds245512.mlab.com:45512/shiloh`;
mongoose.connect(uri);
//mongoose.connect('mongodb://localhost/libreria');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');



// RUTAS
const catalogoRoutes      = require('./routes/catalogo');
const indexRoutes         = require('./routes/index');
const commentRoutes       = require('./routes/comment');
const authorRoutes        = require('./routes/author');
app.use(catalogoRoutes);
app.use(indexRoutes);
app.use(commentRoutes);
app.use(authorRoutes);


app.listen(
    5001,'localhost', () => console.log('corriendo')
);

