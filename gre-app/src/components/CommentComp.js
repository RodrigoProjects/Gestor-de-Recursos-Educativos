import { useState } from 'react';
import useFetch from '../utils/useFetch';

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import SubCommentComp from './SubCommentComp'

const jwt = require('jsonwebtoken')

export default function CommentComp(props) {

    const [token, setToken] = useState(jwt.sign({}, process.env.REACT_APP_SECRET))
    const {data : user, isPending, error, update} = useFetch("http://localhost:9701/users/" + props.data.autor, token)
    const [comment, setComment] = useState("")
    const [alert, setAlert] = useState("")
    
    const newComment = (e) => {
        e.preventDefault()

        fetch('http://localhost:9702/api/recursos/sub_comment?id_recurso=' + props.id + "&id_comentario=" + props.data._id + '&token=' + localStorage.getItem("token"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                conteudo: comment,
                autor: JSON.parse(localStorage.getItem("user")).email
            })
        }).then(res => {
            if (res.ok) {
                props.update()
                setComment("")
            } else {
                setAlert("Erro ao contactar o servidor, por favor tente mais tarde.")
            }
        }).catch(e => {
            setAlert(e.message)
        }) 
    }

    return(
        <div className="comment-section border border-dark rounded p-2 mb-3">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            {alert && <Alert variant="danger">{alert}</Alert>}
            {user && 
                <>
                    <div className="comment-header">
                        <img className="comment-image rounded" src={user.avatar ? "http://localhost:9701/avatars/" + user.avatar: "http://localhost:9701/images/userDefault.png"} alt="" />
                        <h5 className="text-dark ml-2">{user.nome}</h5> 
                        <small className="text-muted comment-date">
                            {props.data.dataDeCriacao.replace('T', ' ').slice(0, -5)}
                        </small>
                    </div>
                    <div className="comment-content mt-2">
                        <p className="text-dark">
                            {props.data.conteudo}
                        </p>
                    </div>
                    <div className="pl-4">
                    {props.data.comentarios.map((ele, idx) => {
                        return (
                            <SubCommentComp key={idx} data={ele} />
                        )
                    })}
                    </div>
                    
                    <Form onSubmit={newComment} className="pl-4">
                        <Form.Group controlId="formComment">
                            <div className="d-flex mb-5">
                                <Form.Control onChange={(e) => setComment(e.target.value)} style={{width: "30rem", marginTop: "2vh"}} required name="comment" type="text" placeholder="Escreva uma Resposta..." />
                                <span><Button style={{ marginTop: "2vh"}} type="submit" variant="outline-success">Responder</Button></span>
                            </div>
                        
                        </Form.Group>
                    </Form>
                </>
                }
        </div>
    )
}