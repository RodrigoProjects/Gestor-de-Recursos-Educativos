import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import React from 'react'

import { Redirect, useHistory } from "react-router";

const jwt = require('jsonwebtoken')



const DeleteModal = (props) => {

    const history = useHistory()

    const deleteUser = () =>{
        fetch("http://localhost:9701/users/" + props.id+ "?token=" + jwt.sign({}, process.env.REACT_APP_SECRET), {
          method: "DELETE"
        }).then(function (res) {
          if (res.ok) {
              props.onSuccess()
              history.push("/")
          }
        }, function (e) {
          console.log(e)
        });

    }

    return (
    <>
      <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Quer mesmo apagar a sua conta? (Processo irreversível)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
            <b>Email</b>: {props.id}
        </span>
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
