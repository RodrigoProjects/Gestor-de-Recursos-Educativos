var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var User = require('../controllers/User')
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })

const path = require('path')

const fs = require('fs')

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

router.get('/:email', (req, res) => {

  User.consultar(req.params.email)
    .then(user => {
      res.jsonp(user)
    })
    .catch(e => {
      res.status(500).jsonp({error : e})
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

router.post('/', upload.single('avatar'), (req, res) => {

  let user = req.body

  user.dataDeCriacao = new Date().toISOString()

  if(req.file){

    fs.rename(path.join(__dirname, "../uploads/" + req.file.filename), path.join(__dirname,"../public/avatars/" + req.file.filename + "." + req.file.mimetype.split('/')[1]), (e) => {
      if(!e){
        user.avatar = req.file.filename + "." + req.file.mimetype.split('/')[1]

        User.registar(user)
          .then(_ => {
            res.sendStatus(200)
          }) 
          .catch(e => {
            res.status(500).jsonp({erro: e})
          })
        
      } else {
        res.status(500).jsonp({erro: e})

      }
    })
     
  } else {

    user.avatar = ""
        
    User.registar(user)
      .then(_ => {
        res.sendStatus(200)
      }) 
      .catch(e => {
        res.status(500).jsonp({erro: e})
      })
  }

})

router.delete('/:email', (req, res) => {
  User.remover(req.params.email)
    .then(_ => res.sendStatus(200))
    .catch(e => res.status(404).jsonp({error : e}))
})
  
router.post('/login',passport.authenticate('local'), function(req, res){
  jwt.sign({nome: req.user.nome, email: req.user.email, tipo: req.user.tipo, course: req.user.course}, process.env.JWT_SECRET , {expiresIn :"2h"}, (e, token) => {
    if(e) 
      res.sendStatus(500)
    else
      res.status(200).jsonp({token: token})
  })
})

router.put('/:email', upload.single('avatar'), (req, res) => {
  
  let user = req.body

  if(req.file){

    fs.rename(path.join(__dirname, "../uploads/" + req.file.filename), path.join(__dirname,"../public/avatars/" + req.file.filename + "." + req.file.mimetype.split('/')[1]), (e) => {
      if(!e){
        user.avatar = req.file.filename + "." + req.file.mimetype.split('/')[1]

        User.update(req.params.email, user)
        .then(_ => res.sendStatus(200))
        .catch(e => res.status(500).jsonp({error : e}))
        
      } else {
        res.status(500).jsonp({erro: e})
      }
    })
     
  } else {

    User.update(req.params.email, user)
    .then(_ => res.sendStatus(200))
    .catch(e => res.status(500).jsonp({error : e}))
  }

})

module.exports = router;