var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const Recurso = require('../controllers/Recurso')
const Pedido = require('../controllers/Pedido')
const Noticia = require('../controllers/Noticia')
const Notificacao = require('../controllers/Notificacao')
const TipoRecurso = require('../controllers/TipoRecurso')

var { v4: uuidv4 } = require('uuid');

const multer = require('multer')
var upload_recursos = multer({ dest: 'uploads/' })

const path = require('path')

const fs = require('fs')

//Roteamentos CRUD para Recurso ---------------------------
router.get('/recursos/ficheiro', function(req, res, next) {
  if(req.query.folder && req.query.file){
    res.download(path.join(__dirname,"../public/recursos/" + req.query.folder + "/" + req.query.file))
  }
  else{
    res.sendStatus(500);
  }
});


router.get('/recursos', function(req, res, next) {
  if(req.query.email){
    Recurso.getRecursosByAuthor(req.query.email)
    .then(recs =>{

      res.jsonp(recs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })    
  }
  else if (req.query.id){
    Recurso.getRecursoById(req.query.id)
    .then(recs =>{

      res.jsonp(recs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })   
  }
  else{
    Recurso.getRecursos()
    .then(recs =>{

      res.jsonp(recs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
  }
});

router.get('/recursos/publicos', function(req, res, next) {
  Recurso.getPublicRecursos()
    .then(recs =>{

      res.jsonp(recs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/recursos', upload_recursos.fields([{
  name: "imagem", maxCount: 1
},
{
  name: "ficheiros", maxCount: 20
}]), function(req, res, next) {

  let recurso =  req.body
  let files = []
  let folder = uuidv4()

  recurso.pasta = folder

  recurso.classificadores = []

  recurso.ficheiros = files


  let ficheiros = req.files.ficheiros

  try{

    fs.mkdirSync(path.join(__dirname,"../public/recursos/" + folder))

    ficheiros.forEach( file => {
      
      fs.renameSync(path.join(__dirname, "../uploads/" + file.filename), path.join(__dirname,"../public/recursos/" + folder + "/" + file.originalname))
      
      recurso.ficheiros.push(file.originalname)  
      
    })

    

    if(req.files.imagem){

      
      let image = req.files.imagem[0]
      
      

      fs.renameSync(path.join(__dirname, "../uploads/" + image.filename), path.join(__dirname,"../public/images/" + image.originalname))

      recurso.imagem = image.originalname
      
    } else {
      recurso.imagem = ""
  
    }


    recurso.dataDeCriacao = new Date().toISOString()

    Recurso.insert(recurso)
      .then(_ =>{
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })

  } catch(e){
    res.status(500).jsonp({error: e})
  }

});

router.post('/recursos/comment/:id_recurso', function(req, res, next) {
  let comentario =  req.body
  comentario._id = mongoose.Types.ObjectId();
  comentario.comentarios = []
  comentario.dataDeCriacao = new Date().toISOString()

  Recurso.updateComment(req.params.id_recurso,comentario)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/recursos/sub_comment', function(req, res, next) {
  if(req.query.id_recurso && req.query.id_comentario){
    let comentario =  req.body
    comentario._id = mongoose.Types.ObjectId();
    comentario.dataDeCriacao = new Date().toISOString()
  
    Recurso.pushSubComment(req.query.id_recurso,req.query.id_comentario,comentario)
      .then(_ =>{
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })
  
    
  } else {
    res.sendStatus(500)
  }
});

router.post('/recursos/classificador', function(req, res, next) {
  if(req.query.id_recurso){

    Recurso.pushClassificador(req.query.id_recurso, req.body)
      .then(_ =>{
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })
  } else {
    res.sendStatus(500)
  }
});

router.put('/recursos/classificador', function(req, res, next) {

  if(req.query.id_recurso){
    
    let email = req.body.user
    let classificacao = req.body.classificacao

    Recurso.updateClassificador(req.query.id_recurso, email, classificacao)
      .then(_ =>{
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })
  } else {
    res.sendStatus(500)
  }
});

router.put('/recursos/:id', upload_recursos.single('imagem') ,function(req, res, next) {
  
  let recurso = req.body

  if(req.file){

    fs.rename(path.join(__dirname, "../uploads/" + req.file.filename), path.join(__dirname,"../public/images/" + req.file.filename + "." + req.file.mimetype.split('/')[1]), (e) => {
      if(!e){
        recurso.imagem = req.file.filename + "." + req.file.mimetype.split('/')[1]

        console.log(recurso)
        Recurso.update(req.params.id,recurso)
        .then(_ =>{
          res.sendStatus(200)
        })
        .catch(e => {
          res.status(500).jsonp({error: e})
        })
        
      } else {
        res.status(500).jsonp({erro: e})
      }
    })
     
  } else {
  Recurso.update(req.params.id,req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
  }
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

router.post('/noticias', upload_recursos.single('imagem') ,function(req, res, next) {
  
  let noticia = req.body

  noticia.dataDeCriacao = new Date().toISOString()
  if(req.file){

    fs.rename(path.join(__dirname, "../uploads/" + req.file.filename), path.join(__dirname,"../public/noticias/" + req.file.filename + "." + req.file.mimetype.split('/')[1]), (e) => {
      if(!e){
        noticia.imagem = req.file.filename + "." + req.file.mimetype.split('/')[1]


        Noticia.insert(noticia)
        .then(_ =>{
          res.sendStatus(200)
        })
        .catch(e => {
          res.status(500).jsonp({error: e})
        })
        
      } else {
        res.status(500).jsonp({erro: e})
      }
    })
     
  } else {

    Noticia.insert(noticia)
      .then(_ =>{
        res.sendStatus(200)
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })
  }
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


//Roteamentos CRUD para Notificacao ---------------------------
router.get('/notificacoes', function(req, res, next) {
  Notificacao.getNotificacoes()
    .then(notfs =>{
      res.jsonp(notfs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.get('/notificacoes/:email', function(req, res, next) {
  Notificacao.getNotificacoesByAddressee(req.body.email)
    .then(notfs =>{
      res.jsonp(notfs)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/notificacoes', function(req, res, next) {
  Notificacao.insert(req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.delete('/notificacoes/:id', function(req, res, next) {
  Notificacao.delete(req.params.id)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});
//--------------------------------------------------

//Roteamentos CRUD para TipoRecurso ---------------------------
router.get('/tiporecursos', function(req, res, next) {
  TipoRecurso.getTipoRecursos()
    .then(tipos =>{
      res.jsonp(tipos)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.post('/tiporecursos', function(req, res, next) {
  TipoRecurso.insert(req.body)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});

router.delete('/tiporecursos/:id', function(req, res, next) {
  TipoRecurso.delete(req.params.id)
    .then(_ =>{
      res.sendStatus(200)
    })
    .catch(e => {
      res.status(500).jsonp({error: e})
    })
});
//--------------------------------------------------

module.exports = router;
