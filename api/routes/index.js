var express = require('express');
var router = express.Router();

const Recurso = require('../controllers/Recurso')
const Pedido = require('../controllers/Pedido')

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


router.get('/pedidos', function(req, res, next) {
  Pedido.getPedidos()
    .then(peds =>{
      res.jsonp(peds)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

module.exports = router;
