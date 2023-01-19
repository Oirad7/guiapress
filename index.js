//INICIALIZAR MYSQL NO WINDOWS

require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');

const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require("./users/User");


connection
    .authenticate()
    .then(() => {
    console.log("Conexão feita com o Banco de Dados!");
    })
    .catch((msgErro) =>{
        console.log("Não foi possível conectar ao Banco de Dados: " + msgErro);
    });

app.set('view engine', 'ejs');

app.use(session({
    secret: "lsdçqcgfegh",
    resave: true, //novo parametro obrigatorio
    saveUninitialized: true, //novo parametro obrigatorio
    cookie: { maxAge: 30000} //miliseg
}));

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);




app.get('/', (req, res) => {
    Article.findAll({
        order: [['id','DESC']],
        limit: 4
    }).then( articles => {
        Category.findAll().then(categories =>  {
            res.render('index', {articles: articles, categories: categories});
        });
    });
})

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories =>  {
                res.render('article', {article: article, categories: categories});
            });
        }else {
            res.redirect('/');
        }
    }).catch( err => {
        res.redirect('/');
    });
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories =>  {
                res.render('index', {articles: category.articles, categories: categories});
            });
        }else {
            res.redirect('/');
        }
    }).catch( err => {
        res.redirect('/');
    });
})

app.listen(8080, () => {
    console.log('o servidor está rodando');
})