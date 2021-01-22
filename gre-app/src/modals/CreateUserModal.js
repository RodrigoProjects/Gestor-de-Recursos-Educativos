import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import useState from 'react'

import Avatar from 'react-avatar-edit'

import useFetch from '../utils/useFetch'

const CreateUserModal = (props) => {

    const {data, isPending, error} = useFetch()
    const [preview, setPreview] = useState(null);

    function onClose() {
      setPreview(null);
    }

    function onCrop(pv) {
      setPreview(pv);
    }

    function onBeforeFileLoad(elem) {
      if (elem.target.files[0].size > 71680) {
        alert("File is too big!");
        elem.target.value = "";
      }
    }

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
            <Avatar 
              width={300}
              height={300}
              onCrop={onCrop}
              onClose={onClose}
              onBeforeFileLoad={onBeforeFileLoad}
              src={null}
            />
            {preview && <img src={preview} alt="Preview" />}
            
            <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="example@gmail.com" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" placeholder="António Costa" />
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
