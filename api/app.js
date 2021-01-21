var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const jwt = require('jsonwebtoken')

const cors = require('cors')

var indexRouter = require('./routes/index');

require('dotenv').config() // Load -.env variables.

var app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use((req, res, next) => {
  
  if(req.headers.authorization) {
    let token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, _) => {
      if(err){
        res.status(401).jsonp({erro: err})
        return
      }
      next()
    })

  } else if(req.query.token){

    jwt.verify(req.query.token, process.env.JWT_SECRET, (err, _) => {
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


app.use('/api', indexRouter);


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
});

module.exports = app;
