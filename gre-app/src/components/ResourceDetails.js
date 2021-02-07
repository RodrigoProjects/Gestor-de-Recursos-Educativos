import { useState } from "react"

import {  BiBookAlt } from "react-icons/bi";
import {  AiOutlineMail,  } from "react-icons/ai";

import {AiFillStar, AiOutlineFile, AiOutlineStar } from "react-icons/ai";

import Button from 'react-bootstrap/Button';
import useFetch from "../utils/useFetch";

import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import { Redirect, useParams } from "react-router";

import CommentComp from "./CommentComp";
import DeleteResourceModal from '../modals/DeleteResourceModal'
import EditResourceModal from '../modals/EditResourceModal'


export default function Details(props) {


    const params = useParams()
    const [token, setToken] = useState(localStorage.getItem("token"))
    const {data : resource, isPending, error, update} = useFetch("http://localhost:9702/api/recursos?id=" + params.id, token)
    const [editModal, setEditModal] = useState(false)
    const [comment, setComment] = useState("")
    const [alert, setAlert] = useState("")
    const [deleteModal, setDeleteModal] = useState(false)


    const newComment = (e) => {
        e.preventDefault()

        fetch('http://localhost:9702/api/recursos/comment/' + resource._id + "?token=" + localStorage.getItem("token"), {
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
                update()
                setComment("")
            } else {
                setAlert("Erro ao contactar o servidor, por favor tente mais tarde.")
            }
        }).catch(e => {
            setAlert(e.message)
        }) 
    }

    const addClassificacao = (i) => {
        fetch('http://localhost:9702/api/recursos/classificador?id_recurso=' + params.id + '&token=' + localStorage.getItem("token"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                classificacao: i,
                user: JSON.parse(localStorage.getItem("user")).email
            })
        }).then(res => {
            if(res.ok){
                update()
            } else {
                setAlert("Erro ao contactar o servidor, por favor tente mais tarde.")
            }
        }).catch(e => {
            setAlert(e.message)
        }) 
    }

    const updateClassificacao = (i) => {
        fetch('http://localhost:9702/api/recursos/classificador?id_recurso=' + params.id + '&token=' + localStorage.getItem("token"), {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                classificacao: i,
                user: JSON.parse(localStorage.getItem("user")).email
            })
        }).then(res => {
            if(res.ok){
                update()
            } else {
                setAlert("Erro ao contactar o servidor, por favor tente mais tarde.")
            }
        }).catch(e => {
            setAlert(e.message)
        }) 
    }

    if(!localStorage.getItem("user")){
        return <Redirect to="/" />
    }

    return (
        <>

            <div className="profile-info">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            {alert && <Alert variant="danger">{alert}</Alert>}
            {resource && <>
                {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email).length == 0 ? <div className="stars">
                    
                    <AiOutlineStar onClick={() => addClassificacao(1)} className="star" size="1.3rem"/>
                    <AiOutlineStar onClick={() => addClassificacao(2)} className="star" size="1.3rem"/>
                    <AiOutlineStar onClick={() => addClassificacao(3)} className="star" size="1.3rem"/>
                    <AiOutlineStar onClick={() => addClassificacao(4)} className="star" size="1.3rem"/>
                    <AiOutlineStar onClick={() => addClassificacao(5)} className="star" size="1.3rem"/>
                </div> : 
                <div className="stars">
                    {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email)[0].classificacao >= 1 ? <AiFillStar onClick={() => updateClassificacao(1)} className="star" size="1.3rem"/> : <AiOutlineStar onClick={() => updateClassificacao(1)} className="star" size="1.3rem"/>} 
                    {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email)[0].classificacao >= 2 ? <AiFillStar onClick={() => updateClassificacao(2)} className="star" size="1.3rem"/> : <AiOutlineStar onClick={() => updateClassificacao(2)} className="star" size="1.3rem"/>} 
                    {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email)[0].classificacao >= 3 ? <AiFillStar onClick={() => updateClassificacao(3)} className="star" size="1.3rem"/> : <AiOutlineStar onClick={() => updateClassificacao(3)} className="star" size="1.3rem"/>} 
                    {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email)[0].classificacao >= 4 ? <AiFillStar onClick={() => updateClassificacao(4)} className="star" size="1.3rem"/> : <AiOutlineStar onClick={() => updateClassificacao(4)} className="star" size="1.3rem"/>} 
                    {resource.classificadores.filter(el => el.user == JSON.parse(localStorage.getItem("user")).email)[0].classificacao >= 5 ? <AiFillStar onClick={() => updateClassificacao(5)} className="star" size="1.3rem"/> : <AiOutlineStar onClick={() => updateClassificacao(5)} className="star" size="1.3rem"/>} 
                    
                </div> 
                
                
                }
                <div className="profile-actions2 mb-5">
                    {(props.edit || resource.autor === JSON.parse(localStorage.getItem("user")).email) && <Button variant="primary" onClick={() => setEditModal(true)}>Editar</Button>}
                    {(props.edit || resource.autor === JSON.parse(localStorage.getItem("user")).email) && <Button variant="danger" className="ml-3" onClick={() => setDeleteModal(true)}>Apagar</Button>}
                </div>
                <div className="profile-header">
                    <img className="profile-image" src={resource.imagem ? "http://localhost:9702/images/" + resource.imagem: "http://localhost:9702/images/defaultResource.png"} alt="" />
                    <b style={{ fontSize: "1.8vw"}}>{resource.titulo}</b>
                    <small className="text-muted">{resource.dataDeCriacao.replace('T', ' ').slice(0, -5)}</small>
                    <div>{resource.classificadores.length > 0 ? (resource.classificadores.reduce((acc, v) => acc + v.classificacao, 0) / resource.classificadores.reduce((acc, _) => acc + 1,0)).toFixed(2) : "0"}/5 <AiFillStar style={{color: "#dba100"}}/></div>
                </div>
                <div className="user-data">
                    <div>
                        <span style={{fontSize: "1.2rem"}}> <AiOutlineMail /> {resource.autor}</span>
                    </div>
                    <div>
                        <span style={{fontSize: "1.2rem"}}> <BiBookAlt /> {resource.tipo}</span>
                    </div>
                    <div>
                        <span style={{fontSize: "1.2rem"}}> <b className="text-dark">Estado:</b> {resource.estado}</span>
                    </div>
                </div>
                <div>
                    <h5 style={{textAlign: "center"}}className="mt-5">Descrição:</h5>
                    <div style={{fontSize: "1.2rem"}} className="text-dark mt-3">{resource.descricao}</div>
                </div>
                <div>
                    <h5 style={{textAlign: "center"}}className="mt-5">Ficheiros:</h5>
                    <ListGroup className="mt-3">
                        {resource.ficheiros.map((el, idx) => {
                            return (<ListGroup.Item key={idx} style={{display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: "14rem"}}>
                                <a className="mr-2" href={"http://localhost:9702/api/recursos/ficheiro?folder=" + resource.pasta + "&file=" + el + "&token=" + localStorage.getItem("token")} >{el}</a>
                                <AiOutlineFile />
                            </ListGroup.Item>)
                        })}
                    </ListGroup>
                </div>
                
                
                <div className="profile-separator"></div>
                <div className="comments">
                    <h5 className="mt-3 text-dark mb-4">Comentários:</h5>
                    {resource.comentarios.map((el, idx) => {
                        return(
                            <CommentComp update={() => update()} key={idx} data={el} id={params.id}/>
                        )
                    })}
                    <Form onSubmit={newComment}>
                        <Form.Group controlId="formComment">
                            <div className="d-flex mb-5">
                                <Form.Control onChange={(e) => setComment(e.target.value)} style={{width: "40rem", marginTop: "2vh"}} required name="comment" type="text" placeholder="Escreva um comentário..." />
                                <span><Button style={{ marginTop: "2vh"}} type="submit" variant="outline-success">Comentar</Button></span>
                            </div>
                        
                        </Form.Group>
                    </Form>
                    
                </div>
                {(props.edit || resource.autor === JSON.parse(localStorage.getItem("user")).email) && <EditResourceModal path={props.path} onSuccess={()=>{update();setEditModal(false)}} id={params.id} show={editModal} onHide={() => setEditModal(false)} />}
                {(props.edit || resource.autor === JSON.parse(localStorage.getItem("user")).email) && <DeleteResourceModal path={props.path} onSuccess={()=>{}} id={params.id} show={deleteModal} onHide={() => setDeleteModal(false)} />}
                </>
                }
                
            </div>
            
        </>
    )
}