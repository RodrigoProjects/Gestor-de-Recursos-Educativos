import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react'

import useFetch from '../utils/useFetch'
import Alert from 'react-bootstrap/esm/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';

const jwt = require('jsonwebtoken')

const EditUserModal = (props) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const {data : noticiaFetch, isPending, error} = useFetch("http://localhost:9702/api/noticias/"+ props.id,token)
    const [noticia, setNoticia] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState()
    const [alert, setAlert] = useState("")

    const onSelectFile = e => {
      if (!e.target.files || e.target.files.length === 0) {
          setSelectedFile(undefined)
          return
      }

      setSelectedFile(e.target.files[0])
    }

    const submitUser = (e) => {
      e.preventDefault()
      
        
        
        let data = new FormData()
      

        for(let el in noticia){
          data.append(el, noticia[el])
        }

        if(selectedFile){
          data.append("imagem", selectedFile)
        }

        
        fetch("http://localhost:9702/api/noticias/" + props.id + "?token=" + token, {
          method: "PUT",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setAlert(null)
            setSelectedFile(undefined)
            setNoticia({})
            localStorage.setItem("created", "Notícia editada!")
            props.onSuccess()

          } else if (res.status == 401) {
            setPreview(null)   
            setAlert("Utilizador não autenticado! Faça login.")
          }
        }, function (e) {
          setPreview(null)   
          setAlert("Erro ao contactar o servidor!");
        });

    }

    useEffect(() => {
      if (!selectedFile) {
          setPreview(undefined)
          return
      }
      
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

  

  return (
    <>
      <Modal
      show={props.show}
      onHide={() => {setSelectedFile(undefined);setAlert(null);setPreview(null);props.onHide()}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar notícia:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        {isPending && <Spinner animation="border"/>}
        {error && <Alert variant="danger">{error}</Alert>}
        {noticiaFetch &&
        <Form onSubmit={submitUser}>
        <img alt="" src={noticiaFetch.imagem ? 'http://localhost:9701/avatars/' + noticiaFetch.imagem : 'http://localhost:9702/images/noticiaDefault.png'}  style={{width : "100px", "margin-bottom" : "2vh"}} />
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Avatar</Form.Label>
              <Form.Control onChange={onSelectFile} name="imagem" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{"margin-top": "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control required onChange={(e) => setNoticia({...noticia,titulo: e.target.value})} name="titulo" type="text" placeholder="" value={noticia.titulo ? noticia.titulo : noticia.titulo == "" ? noticia.titulo : noticiaFetch.titulo}/>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridNome">
                    <Form.Label>Href</Form.Label>
                    <Form.Control onChange={(e) => setNoticia({...noticia,href: e.target.value})} name="href" type="text" placeholder="" value={noticia.href ? noticia.href : noticia.href == "" ? noticia.href : noticiaFetch.href}/>
                </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridDescricao">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control onChange={(e) => setNoticia({...noticia,descricao: e.target.value})} name="descricao" type="text" placeholder="" value={noticia.conteudo ? noticia.conteudo : noticia.conteudo == "" ? noticia.conteudo : noticiaFetch.conteudo}/>
                </Form.Group>
            </Form.Row>
              <Button type="submit" variant="outline-primary">Editar</Button>
            
        </Form>}

      </Modal.Body>
    </Modal>
    </>
  )
}

export default EditUserModal
