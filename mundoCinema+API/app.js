const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient } = require('mongodb'); 
const uri = process.env.URI || "mongodb+srv://juliamaria13:juliamaria13@mundocinema.z7d59.mongodb.net/";
const client = new MongoClient(uri);
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta 3005');
});

app.get('/', (req, res) => {
  console.log('Página inicial acessada!');
  res.render('index');
});

var indexRouter = require('./routes/index');
var marilynRouter = require('./routes/marilyn');
var carmenRouter = require('./routes/carmen');
var narizRouter = require('./routes/nariz');
var passadoRouter = require('./routes/passado');
var sobrenosRouter = require('./routes/sobrenos');

// Conectar ao MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

connectToDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/marilyn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3007/noticias/66f158c7b3e4b7bfc71e9f8f'); // Certifique-se de usar o ID correto da notícia de Marilyn
    const noticia = response.data; // Altere para um único objeto
    res.render('noticias', { noticia });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar a notícia');
  }
});
app.get('/carmen', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3007/noticias/66f158ebb3e4b7bfc71e9f90'); // Certifique-se de usar o ID correto da notícia de Marilyn
    const noticia = response.data; // Altere para um único objeto
    res.render('noticias', { noticia });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar a notícia');
  }
});

app.get('/nariz', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3007/noticias/66f15901b3e4b7bfc71e9f91'); // Certifique-se de usar o ID correto da notícia de Marilyn
    const noticia = response.data; // Altere para um único objeto
    res.render('noticias', { noticia });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar a notícia');
  }
});
app.get('/passado', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3007/noticias/66f15911b3e4b7bfc71e9f92'); // Certifique-se de usar o ID correto da notícia de Marilyn
    const noticia = response.data; // Altere para um único objeto
    res.render('noticias', { noticia });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar a notícia');
  }
});


app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/marilyn', marilynRouter);
app.use('/carmen', carmenRouter);
app.use('/nariz', narizRouter);
app.use('/passado', passadoRouter);
app.use('/sobrenos', sobrenosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
