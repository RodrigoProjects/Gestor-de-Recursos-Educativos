import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import React from 'react'

import { useHistory } from "react-router";

const jwt = require('jsonwebtoken')



const DeleteModal = (props) => {

    const history = useHistory()

    const deleteUser = () =>{
        fetch("http://localhost:9702/api/recursos/" + props.id+ "?token=" + localStorage.getItem("token"), {
          method: "DELETE"
        }).then(function (res) {
          if (res.ok) {
              props.onSuccess()
              history.push(props.path)
          }
        }, function (e) {
          console.log(e)
        });

    }

    return (
    <>
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Quer mesmo apagar este recurso? (Processo irreversível)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="deleteButtons"  style={{"margin-top": "3vh"}}>
            <Button variant="outline-success" onClick={deleteUser}>
                Sim
            </Button>
            <Button variant="outline-danger" onClick={props.onHide}>
                Não
            </Button>
        </div>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default DeleteModal
