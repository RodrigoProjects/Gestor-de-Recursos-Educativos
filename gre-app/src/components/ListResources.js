import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';


import { BiSearchAlt } from "react-icons/bi";
import { AiOutlinePlus, AiFillStar } from "react-icons/ai";

import { useState } from 'react';
import useFetch from '../utils/useFetch';

import CreateResourceModal from '../modals/CreateResourceModal'
import { useHistory } from 'react-router-dom';

const jwt = require('jsonwebtoken')

export default function ListResources(props){

    const [token, setToken] = useState(localStorage.getItem("token"))
    const {data: resources, isPending, error, update} = useFetch("http://localhost:9702/api/recursos" + props.type, token)
    const [search, setSearch] = useState("")
    const [createModal, setCreateModal] = useState(false)
    const [showAlert, setShow] = useState(true);
    const history = useHistory()

    return(
        <>
            <div className="users">
                <div className="action-bar">
                    <div>
                        <input type="text" onChange={(e) => setSearch(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                        <span> <BiSearchAlt size={23}/></span>
                    </div>
                {JSON.parse(localStorage.getItem("user")).tipo !== "User" &&<Button variant="outline-success" onClick={() => setCreateModal(true)}><AiOutlinePlus size={25} /></Button>}
                </div>
                <div className="separator-users">
                    {localStorage.getItem("created") && showAlert &&  
                    <Alert variant="success" onClose={() => {setShow(false); localStorage.removeItem("created")}} dismissible>
                        <Alert.Heading>{localStorage.getItem("created")}</Alert.Heading>
                    </Alert>
                    }
                </div>
                <div className="content">
                    {isPending && <Spinner animation="border"/>}
                    {error && <Alert variant="danger">{error.message}</Alert>}
                    {resources && resources.map((res, idx) => {
                        if(res.titulo.includes(search) || res.tipo.includes(search) || res.autor.includes(search)){
                            return (
                                <div key={idx} onClick={() => history.push(props.path + "/" + res._id)} className="resource-card border border-dark rounded">
                                    <div className="image-wrapper">
                                        <img className="resource-image" src={res.imagem ? "http://localhost:9702/images/" + res.imagem : "http://localhost:9702/images/defaultResource.png"} alt=""/>
                                    </div>
                                    <div className="resource-info ml-2">
                                        <div className="title-autor">
                                            <h5 className="text-dark">{res.titulo}</h5>
                                            <small className="text-muted mt-0 ml-1">{res.autor}</small>
                                            <p className="mt-1 descricao">{res.descricao}</p>
                                        </div>
                                       <div className="type-classificacao">
                                           <div>{res.classificadores.length > 0 ? (res.classificadores.reduce((acc, v) => acc + v.classificacao, 0) / res.classificadores.reduce((acc, _) => acc + 1,0)).toFixed(2) : "0"}/5 <AiFillStar style={{color: "#dba100"}}/></div>
                                           <div className="text-muted">{res.tipo}</div>
                                       </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                
            </div>
            <CreateResourceModal showAlert={() => {setShow(true); update()}} show={createModal} onHide={() => setCreateModal(false)} />
        </>
    )
}