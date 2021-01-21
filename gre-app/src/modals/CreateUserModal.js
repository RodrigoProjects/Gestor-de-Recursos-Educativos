import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import useFetch from '../utils/useFetch'

const CreateUserModal = (props) => {

    const {data, isPending, error} = useFetch()

  return (
    <>
      <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Criar novo utilizador
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="example@gmail.com" />
            </Form.Group>
            </Form.Row>
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default CreateUserModal
