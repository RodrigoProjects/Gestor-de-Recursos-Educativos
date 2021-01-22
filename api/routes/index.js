var express = require('express');
var router = express.Router();

const Recurso = require('../controllers/Recurso')
const Pedido = require('../controllers/Pedido')
const Noticia = require('../controllers/Noticia')


//Roteamentos CRUD para Recurso ---------------------------

router.get('/recursos', function(req, res, next) {
  Recurso.getRecursos()
    .then(recs =>{
      res.jsonp(recs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/recursos', function(req, res, next) {
  Recurso.insert(req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.put('/recursos/:id', function(req, res, next) {
  Recurso.update(req.params.id,req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.delete('/recursos/:id', function(req, res, next) {
  Recurso.delete(req.params.id)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

//--------------------------------------------------



//Roteamentos CRUD para Pedido ---------------------------

router.get('/pedidos', function(req, res, next) {
  Pedido.getPedidos()
    .then(peds =>{
      res.jsonp(peds)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/pedidos', function(req, res, next) {
  Pedido.insert(req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.put('/pedidos/:id', function(req, res, next) {
  Pedido.update(req.params.id,req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.delete('/pedidos/:id', function(req, res, next) {
  Pedido.delete(req.params.id)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});
//--------------------------------------------------


//Roteamentos CRUD para Noticia ---------------------------

router.get('/noticias', function(req, res, next) {
  Noticia.getNoticias()
    .then(nots =>{
      res.jsonp(nots)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/noticias', function(req, res, next) {
  Noticia.insert(req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.put('/noticias/:id', function(req, res, next) {
  Noticia.update(req.params.id,req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.delete('/noticias/:id', function(req, res, next) {
  Noticia.delete(req.params.id)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});
//--------------------------------------------------

module.exports = router;
