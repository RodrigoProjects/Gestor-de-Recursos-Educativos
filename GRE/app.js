var createError = require('http-errors'); // Handles HTTP erros.
var express = require('express'); // Express framework, makes HTTP servers less code intensive.
var path = require('path'); // Path operations made easy.
var cookieParser = require('cookie-parser'); // Handles cookies from the client.
var logger = require('morgan'); // Logger on morgan mode.

// Authentication ----------------------------------------------

  // ** Session
  var { v4: uuidv4 } = require('uuid');
  var session = require('express-session');
  const FileStore = require('session-file-store')(session);

  // ** Local Authentication Strategy
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy
  var axios = require('axios')

// -------------------------------------------------------------

// MongoDB -----------------------------------------------------

  const mongoose = require('mongoose')

  //Set up default mongoose connection
  var mongoDB = 'mongodb://127.0.0.1/gre'
  mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

  //Get the default connection
  var db = mongoose.connection

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error...'))
  db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
  })

  // Users controller.
  const User = require('./models/user')

// -------------------------------------------------------------


// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (email, password, done) => {

    User.lookUpEmail(email)
      .then(user => {
        if(!user) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(password != user.password) { return done(null, false, {message: 'Password incorreta!\n'})}
        return done(null, user)
      })
      .catch(erro => {
        return done(erro)
      })
    
    })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  done(null, user._id)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uid, done) => {
  
  User.lookUp(uid)
    .then(user => {
      done(null, user)
    })
    .catch(erro => done(erro, false))
    
})
  
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: false
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('O meu segredo'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
