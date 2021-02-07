import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react'

import Alert from 'react-bootstrap/esm/Alert';

const jwt = require('jsonwebtoken')

const CreateNoticiaModal = (props) => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState()
    const [noticia, setNoticia] = useState({"titulo": "", "conteudo": ""})
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

        data.append("autor", JSON.parse(localStorage.getItem("user")).email)

        
        fetch("http://localhost:9702/api/noticias?token=" + localStorage.getItem("token"), {
          method: "POST",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setNoticia({"titulo": "", "descricao": ""})
            setAlert(null)
            setSelectedFile(undefined)

            localStorage.setItem("created", "Notícia criada!")
            props.showAlert()
            props.onHide();

          } else if (res.status == 401) {
            setPreview(null)   
            setNoticia({"titulo": "", "descricao": ""})
            setAlert("Utilizador não autenticado! Faça login.")
          }
        }, function (e) {
          setPreview(null)   
          setNoticia({"titulo": "", "descricao": ""})
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
      onHide={() => {setSelectedFile(undefined);setAlert(null);setPreview(null);props.onHide();setNoticia({"titulo": "", "descricao": ""})}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Criar nova notícia
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        <Form onSubmit={submitUser}>
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Avatar</Form.Label>
              <Form.Control onChange={onSelectFile} name="imagem" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{marginTop: "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control required onChange={(e) => setNoticia({...noticia, "titulo": e.target.value})} name="titulo" type="text" placeholder="" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formType">
                <Form.Label>Conteúdo</Form.Label>
                <Form.Control required onChange={(e) => setNoticia({...noticia, "conteudo": e.target.value})} name="conteudo" as="textarea"></Form.Control>
              </Form.Group>
            </Form.Row>
              <Button type="submit" variant="outline-success">Criar</Button>
            
        </Form>

      </Modal.Body>
    </Modal>
    </>
  )
}

export default CreateNoticiaModal
