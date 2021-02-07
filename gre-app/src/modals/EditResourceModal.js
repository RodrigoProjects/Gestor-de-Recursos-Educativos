import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react'

import useFetch from '../utils/useFetch'
import Alert from 'react-bootstrap/esm/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useHistory } from 'react-router';

const jwt = require('jsonwebtoken')

const EditProfileModal = (props) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const {data : resource, isPending, error, update} = useFetch("http://localhost:9702/api/recursos?id="+ props.id,token)
    const [res, setRes] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState()
    const [alert, setAlert] = useState("")
    const history = useHistory()
    const {data: tipos, isPendingT, errorT} = useFetch('http://localhost:9702/api/tiporecursos', token)

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
      
        console.log(res)
        for(let el in res){
          data.append(el, res[el])
        }

        if(selectedFile){
          data.append("imagem", selectedFile)
        }

        
        fetch("http://localhost:9702/api/recursos/" + props.id + "?token=" + token, {
          method: "PUT",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setAlert(null)
            setSelectedFile(undefined)
            setRes({})
            localStorage.setItem("created", "Recurso editado!")
            props.onSuccess()
            update()

          } else if (res.status == 401) {
            setPreview(null)   
            setAlert("Utilizador não autenticado! Faça login.")
            history.push('/')
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
          Editar Recurso:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        {isPending && <Spinner animation="border"/>}
        {error && <Alert variant="danger">{error}</Alert>}
        {resource &&
            <Form onSubmit={submitUser}>
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Imagem</Form.Label>
              <Form.Control onChange={onSelectFile} name="image" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{"margin-top": "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Título</Form.Label>
                    <Form.Control required onChange={(e) => setRes({...res, "titulo": e.target.value})} name="titutlo" type="text" placeholder="" value={res.titulo ? res.titulo : res.titulo == "" ? res.titulo : (resource.titulo)}/>
                </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formAcesso">
                <Form.Label>Acesso</Form.Label>
                <Form.Control required onChange={(e) => setRes({...res, "acesso": e.target.value})} name="acesso" as="select" defaultValue="Escolher..." value={res.acesso ? res.acesso : res.acesso == "" ? res.acesso : (resource.acesso)}>
                  <option value="">Escolher...</option>
                  <option>Privado</option>
                  <option>Público</option>
                </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formType">
                <Form.Label>Tipo</Form.Label>
                <Form.Control required onChange={(e) => setRes({...res, "tipo": e.target.value})} name="tipo" as="select" defaultValue="Escolher..." value={res.tipo ? res.tipo : res.tipo == "" ? res.tipo : (resource.tipo)}>
                  <option value="">Escolher...</option>
                  {tipos && tipos.map((el, idx) => {
                    return (<option key={idx}>{el.tipo}</option>)
                  })}
                </Form.Control>
              </Form.Group>
             {JSON.parse(localStorage.getItem("user")).tipo == "Admin" && <Form.Group as={Col} controlId="formState">
                <Form.Label>Estado</Form.Label>
                <Form.Control required onChange={(e) => setRes({...res, "estado": e.target.value})} name="estado" as="select" defaultValue="Escolher..." value={res.estado ? res.estado : res.estado == "" ? res.estado : (resource.estado)}>
                  <option value="">Escolher...</option>
                  <option>Confirmado</option>
                  <option>Recusado</option>
                  <option>Em avaliação</option>
                </Form.Control>
              </Form.Group>}
            </Form.Row>
              <Form.Group controlId="formDescricao">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control required onChange={(e) => setRes({...res, "descricao": e.target.value})} name="descricao" as="textarea" value={res.descricao ? res.descricao : res.descricao == "" ? res.descricao : (resource.descricao)}>
                  </Form.Control>
              </Form.Group>
              <hr></hr>
              <Button type="submit" style={{marginTop: "2vh"}} variant="outline-primary">Editar</Button>
            
        </Form>}

      </Modal.Body>
    </Modal>
    </>
  )
}

export default EditProfileModal
