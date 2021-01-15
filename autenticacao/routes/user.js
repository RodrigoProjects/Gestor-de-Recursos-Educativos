var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var User = require('../controllers/User')

require('dotenv').config() // Load -.env variables.

var passport = require('passport')

router.get('/', (req, res) => {
  User.listar()
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(e => {
      res.status(500).jsonp({erro : e})
    })
})

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
        res.redirect('/');
    } else {
        console.log('Destroy session error: ', err)
    }
  });
});

router.post('/', (req, res) => {
  User.registar(req.body)
    .then(_ => res.sendStatus(200))
    .catch(e => res.sendStatus(500))
})

router.delete('/:user_id', (req, res) => {
  User.remover(req.params.user_id)
    .then(_ => res.sendStatus(200))
    .catch(e => res.status(404).jsonp({error : e}))
})
  
router.post('/login', passport.authenticate('local'), function(req, res){
  jwt.sign({nome: req.user.nome, email: req.user.email, tipo: req.user.tipo, course: req.user.course}, process.env.JWT_SECRET , (e, token) => {
    if(e) 
      res.sendStatus(500)
    else
      res.status(200).jsonp({token: token})
  })
})

module.exports = router;