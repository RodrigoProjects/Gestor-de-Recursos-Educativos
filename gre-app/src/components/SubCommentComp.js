import { useState } from 'react';
import useFetch from '../utils/useFetch';

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const jwt = require('jsonwebtoken')

export default function SubCommentComp(props) {

    const [token, setToken] = useState(jwt.sign({}, process.env.REACT_APP_SECRET))
    const {data : user, isPending, error, update} = useFetch("http://localhost:9701/users/" + props.data.autor, token)
    

    return(
        <div className="comment-subsection border border-dark rounded p-2 mt-3">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            {user && 
                <>
                    <div className="comment-subheader">
                        <img className="" className="comment-image rounded" src={user.avatar ? "http://localhost:9701/avatars/" + user.avatar: "http://localhost:9701/images/userDefault.png"} alt="" />
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
                </>
                }
        </div>
    )
}