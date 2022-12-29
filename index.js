//INICIALIZAR MYSQL NO WINDOWS

require('dotenv').config();
const express = require('express');
const app = express();
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');


connection
    .authenticate()
    .then(() => {
    console.log("Conexão feita com o Banco de Dados!");
    })
    .catch((msgErro) =>{
        console.log("Não foi possível conectar ao Banco de Dados: " + msgErro);
    });

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/', categoriesController);
app.use('/', articlesController)

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(8080, () => {
    console.log('o servidor está rodando');
})