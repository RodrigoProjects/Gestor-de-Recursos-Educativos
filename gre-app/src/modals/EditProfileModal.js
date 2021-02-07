import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react'

import useFetch from '../utils/useFetch'
import Alert from 'react-bootstrap/esm/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';

const jwt = require('jsonwebtoken')

const EditProfileModal = (props) => {

    const [token, setToken] = useState(jwt.sign({}, process.env.REACT_APP_SECRET))
    const {data : userr, isPending, error} = useFetch("http://localhost:9701/users/"+ props.id,token)
    const [user, setUser] = useState({})
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
      
      
      if(userr.nome.trim() !== "" || userr.email.trim() !== "" || userr.password.trim() !== "" || userr.tipo.trim() !== "" || userr.course.trim() !== ""){
        
        
        let data = new FormData()
      

        for(let el in user){
          data.append(el, user[el])
        }

        if(selectedFile){
          data.append("avatar", selectedFile)
        }

        
        fetch("http://localhost:9701/users/" + props.id + "?token=" + jwt.sign({}, process.env.REACT_APP_SECRET), {
          method: "PUT",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setAlert(null)
            setSelectedFile(undefined)
            setUser({})
            localStorage.setItem("created", "Utilizador editado!")
            props.onSuccess()

          } else if (res.status == 401) {
            setPreview(null)   
            setAlert("Utilizador não autenticado! Faça login.")
          }
        }, function (e) {
          setPreview(null)   
          setAlert("Erro ao contactar o servidor!");
        });


      } else {
        setAlert("Por favor preencha todos os campos. O avatar é opcional.")
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
      onHide={() => {setSelectedFile(undefined);setAlert(null);setPreview(null);props.onHide()}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Utilizador: {props.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        {isPending && <Spinner animation="border"/>}
        {error && <Alert variant="danger">{error}</Alert>}
        {userr &&
        <Form onSubmit={submitUser}>
        <img alt="" src={userr.avatar ? 'http://localhost:9701/avatars/' + userr.avatar : 'http://localhost:9701/images/userDefault.png'}  style={{width : "100px", "margin-bottom" : "2vh"}} />
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Avatar</Form.Label>
              <Form.Control onChange={onSelectFile} name="avatar" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{"margin-top": "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required onChange={(e) => setUser({...user,email: e.target.value})} name="email" type="email" placeholder="example@gmail.com" value={user.email ? user.email : user.email == "" ? user.email : userr.email}/>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control onChange={(e) => setUser({...user,nome: e.target.value})} name="nome" type="text" placeholder="António Costa" value={user.nome ? user.nome : user.nome == "" ? user.nome : userr.nome}/>
                </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formCourse">
                <Form.Label>Curso</Form.Label>
                <Form.Control required onChange={(e) => setUser({...user,course: e.target.value})} name="course" as="select" defaultValue="Escolher..." value={user.course ? user.course : user.course == "" ? user.course : (userr.course)}>
                  <option value="">Escolher...</option>
                  <option>Todos</option>
                  <option>MIEI</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
              <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control required onChange={(e) => setUser({...user,password: e.target.value})} name="password" type="password" value={user.password ? user.password : user.password == "" ? user.password : (userr.password)}>
                  </Form.Control>
              </Form.Group>
              <Button type="submit" variant="outline-primary">Editar</Button>
            
        </Form>}

      </Modal.Body>
    </Modal>
    </>
  )
}

export default EditProfileModal
