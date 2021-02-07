import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect, useRef } from 'react'

import Alert from 'react-bootstrap/esm/Alert';

const jwt = require('jsonwebtoken')

const CreateUserModal = (props) => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState()
    const [user, setUser] = useState({"nome": "", "password" : "", "email": "", "course" : ""})
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
      
      
      if(user.nome.trim() !== "" && user.email.trim() !== "" && user.password.trim() !== "" && user.course.trim() !== ""){
        
        
        let data = new FormData()
        
        data.append("tipo", "User")

        for(let el in user){
          data.append(el, user[el])
        }

        if(selectedFile){
          data.append("avatar", selectedFile)
        }
        
        fetch("http://localhost:9701/users?token=" + jwt.sign({}, process.env.REACT_APP_SECRET), {
          method: "POST",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setUser({"nome": "", "password" : "", "email": "", "course" : ""})
            setAlert(null)
            setSelectedFile(undefined)

            localStorage.setItem("created", "Utilizador criado!")
            props.showAlert()
            props.onHide()

          } else if (res.status == 401) {
            setPreview(null)   
            setUser({"nome": "", "password" : "", "email": "", "course" : ""})
            setAlert("Utilizador não autenticado! Faça login.")
          }
        }, function (e) {
          setPreview(null)   
          setUser({"nome": "", "password" : "", "email": "", "course" : ""})
          setAlert("Erro ao contactar o servidor!");
        });


      } else {
        setAlert("Por favor preencha todos os camps. O avatar é opcional.")
      }
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
      onHide={() => {setSelectedFile(undefined);setAlert(null);setPreview(null);props.onHide();setUser({"nome": "", "password" : "", "email": "", "course" : ""})}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Criar novo utilizador
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        <Form onSubmit={submitUser}>
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Avatar</Form.Label>
              <Form.Control onChange={onSelectFile} name="avatar" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{"margin-top": "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required onChange={(e) => setUser({...user, "email": e.target.value})} name="email" type="email" placeholder="example@gmail.com" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control onChange={(e) => setUser({...user, "nome": e.target.value})} name="nome" type="text" placeholder="António Costa" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formCourse">
                <Form.Label>Curso</Form.Label>
                <Form.Control required onChange={(e) => setUser({...user, "course": e.target.value})} name="course" as="select" defaultValue="Escolher...">
                  <option value="">Escolher...</option>
                  <option>Todos</option>
                  <option>MIEI</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
              <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control required onChange={(e) => setUser({...user, "password": e.target.value})} name="password" type="password">
                  </Form.Control>
              </Form.Group>
              <Button type="submit" variant="outline-success">Criar</Button>
            
        </Form>

      </Modal.Body>
    </Modal>
    </>
  )
}

export default CreateUserModal
