import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from 'react'

import Alert from 'react-bootstrap/esm/Alert';


const CreateUserModal = (props) => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState()
    const [resource, setResource] = useState(JSON.parse(localStorage.getItem("user")).tipo === "Admin" ? {"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""} : {"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""})
    const [alert, setAlert] = useState("")
    const [files, setFiles] = useState({ 0 : {file: null}})
    const [fileId, setFileId] = useState(1)
    

    const  deleteFileForm = () => {
        let aux = {}

        Object.keys(files).forEach( el => {
            if(el != fileId - 1) {
                aux[el] = files[el] 
            }
        })
        delete files[fileId - 1]
        setFiles(aux)
        
        setFileId(fileId - 1)
      
    }

    const newFileForm = () => {
        let aux = files
        let number = fileId

        aux[number] = {comp: 
            <Form.Group as={Col} controlId="formGridFile" key={number}>
                
                <Form.Label>Ficheiro</Form.Label>
                <Form.Control onChange={(e) => onNewFile(e, number)} name="ficheiro" type="file" size="20000000" />
            </Form.Group>
        , file: null}
        
        setFiles(aux)

        setFileId(fileId+1)
    }

    const onNewFile = (e, id) => {
        if (!e.target.files || e.target.files.length === 0) {
            let aux = {}

            Object.keys(files).map( el => {
                if(el != id) {
                    aux[el] = files[el] 
                } else {
                    aux[el] = files[el]
                    aux[el]["file"] = null
                }
            })
            
            setFiles(aux)
            return
        }

        let aux = files
        aux[id]["file"] = e.target.files[0]
        setFiles(aux)

    }
    const onSelectFile = e => {
      if (!e.target.files || e.target.files.length === 0) {
          setSelectedFile(undefined)
          return
      }

      setSelectedFile(e.target.files[0])
    }

    const submitUser = (e) => {
      e.preventDefault()
      
      
      if(resource.titulo.trim() !== "" && resource.acesso.trim() !== ""  && resource.descricao.trim() !== "" && resource.tipo.trim() !== ""){
        

        let data = new FormData()

        if(JSON.parse(localStorage.getItem("user")).tipo !== "Admin"){
          console.log("im here")
          data.append("estado", "Em avaliação")
        }
      

        for(let el in resource){
          data.append(el, resource[el])
        }

        if(selectedFile){
          data.append("imagem", selectedFile)
        }

        for(let file in files){

            data.append("ficheiros", files[file].file)
        }

        data.append("autor", JSON.parse(localStorage.getItem("user")).email)

        
        fetch("http://localhost:9702/api/recursos?token=" + localStorage.getItem("token"), {
          method: "POST",
          body: data
        }).then(function (res) {
          if (res.ok) {
            
            setPreview(null)   
            setResource({"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""})
            setAlert(null)
            setSelectedFile(undefined)

            localStorage.setItem("created", "Recurso criado!")
            props.showAlert()
            props.onHide();

          } else if (res.status == 401) {
            setPreview(null)   
            setResource({"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""})
            setAlert("Utilizador não autenticado! Faça login.")
          }
        }, function (e) {
          setPreview(null)   
          setResource({"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""})
          setAlert("Erro ao contactar o servidor!");
        });


      } else {
        setAlert("Por favor preencha todos os camps. A imagem é opcional.")
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
      onHide={() => {setFiles({ 0 : {file: null}});setSelectedFile(undefined);setAlert(null);setPreview(null);props.onHide();setResource({"titulo": "", "acesso" : "", "estado": "", "descricao" : "", "tipo" : ""})}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Criar novo recurso
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && <Alert variant="danger">{alert}</Alert>}
        <Form onSubmit={submitUser}>
          <Form.Group as={Col} controlId="formGridFile">
              <Form.Label>Imagem</Form.Label>
              <Form.Control onChange={onSelectFile} name="image" type="file" size="20000000" accept="image/png, image/jpeg" />
              {selectedFile &&  <img style={{"margin-top": "2vh"}} src={preview} width={120} height={120}/> }
          </Form.Group>
            
            <Form.Row style={{"margin-top": "3vh"}}>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Título</Form.Label>
                    <Form.Control required onChange={(e) => setResource({...resource, "titulo": e.target.value})} name="titutlo" type="text" placeholder="" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formAcesso">
                <Form.Label>Acesso</Form.Label>
                <Form.Control required onChange={(e) => setResource({...resource, "acesso": e.target.value})} name="acesso" as="select" defaultValue="Escolher...">
                  <option value="">Escolher...</option>
                  <option>Privado</option>
                  <option>Público</option>
                </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formType">
                <Form.Label>Tipo</Form.Label>
                <Form.Control required onChange={(e) => setResource({...resource, "tipo": e.target.value})} name="tipo" as="select" defaultValue="Escolher...">
                  <option value="">Escolher...</option>
                  <option>Tese</option>
                  <option>Teste</option>
                  <option>Resolução de teste</option>
                  <option>Slides teóricos</option>
                  <option>Gravação de aula</option>
                  <option>Trabalho de grupo</option>
                </Form.Control>
              </Form.Group>
              {JSON.parse(localStorage.getItem("user")).tipo == "Admin" && <Form.Group as={Col} controlId="formState">
                <Form.Label>Estado</Form.Label>
                <Form.Control required onChange={(e) => setResource({...resource, "estado": e.target.value})} name="estado" as="select" defaultValue="Escolher...">
                  <option value="">Escolher...</option>
                  <option>Confirmado</option>
                  <option>Recusado</option>
                  <option>Em avaliação</option>
                </Form.Control>
              </Form.Group>}
            </Form.Row>
              <Form.Group controlId="formDescricao">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control required onChange={(e) => setResource({...resource, "descricao": e.target.value})} name="descricao" as="textarea">
                  </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formFicheiro">
                <Form.Label>Ficheiro</Form.Label>
                    <Form.Control onChange={(e) => onNewFile(e, 0)} name="ficheiro" type="file" size="20000000" />
                </Form.Group>
                {files && 
                    Object.keys(files).map(el => {
                    if(el !== 0) return (files[el].comp)
                })}
              <Button onClick={newFileForm} style={{marginRight: "1vw"}} variant="outline-primary">+1</Button>
              {Object.keys(files).length > 1 &&<Button onClick={deleteFileForm} style={{marginRight: "1vw"}} variant="outline-danger">-1</Button>}
              <hr></hr>
              <Button type="submit" style={{marginTop: "2vh"}} variant="outline-success">Criar</Button>
            
        </Form>

      </Modal.Body>
    </Modal>
    </>
  )
}

export default CreateUserModal
