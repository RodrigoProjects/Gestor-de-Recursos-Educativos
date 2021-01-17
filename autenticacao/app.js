var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken')

const cors = require('cors')

require('dotenv').config() // Load -.env variables.

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GRE', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
});

var User = require('./controllers/User')

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (username, password, done) => {
    User.consultar(username)
      .then(user => {
        if(!user) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(password != user.password) { return done(null, false, {message: 'Password inválida!\n'})}
        return done(null, user)
      })
      .catch(e => {
        done(erro)
      })
    })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  done(null, user.email)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((email, done) => {
  User.consultar(email)
    .then(user => {
      done(null, user)
    })
    .catch(e => {
      done(erro, false)
    })
})
  
var usersRouter = require('./routes/user');

var app = express();

app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore({retries: 2}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(cors())

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  
  if(req.headers.authorization) {

    let token = req.headers.authorization.split(' ')[1]
      
    jwt.verify(token, process.env.APP_SECRET, (err, _) => {
      if(err){
        res.status(401).jsonp({erro: err})
        return
      }
      next()
    })

  } else {
    res.status(401).jsonp({erro: "Authorization header not set."})
  }
  
})

app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({error: err.message});
});

module.exports = app;
