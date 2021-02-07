import { useState } from "react"

import {  BiBookAlt } from "react-icons/bi";
import {  AiOutlineMail,  } from "react-icons/ai";

import EditProfileModal from '../modals/EditProfileModal'
import DeleteProfileModal from '../modals/DeleteProfileModal'

import Button from 'react-bootstrap/Button';
import useFetch from "../utils/useFetch";

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import {AiFillStar } from "react-icons/ai";

import { Redirect, useHistory } from "react-router";

const jwt = require('jsonwebtoken')

export default function Profile(props) {


    const userS = JSON.parse(localStorage.getItem("user"))
    const history = useHistory()
    const [token, setToken] = useState(jwt.sign({}, process.env.REACT_APP_SECRET))
    const {data : user, isPending, error, update} = useFetch("http://localhost:9701/users/" + userS.email, token)
    const {data: resources, isPending: pending, error:resError} = useFetch("http://localhost:9702/api/recursos?email=" + userS.email, localStorage.getItem("token"))
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [userId, setUserId] = useState(null)


    const editUser = (email) => {
        setUserId(email)
        setEditModal(true);
    }

    const deleteUser = (email) => {
        setUserId(email)
        setDeleteModal(true);
    }

    if(!localStorage.getItem("user")){
        return <Redirect to="/" />
    }

    return (
        <>

            <div className="profile-info">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            {user && <>
                <div className="profile-header">
                    <img className="profile-image" src={user.avatar ? "http://localhost:9701/avatars/" + user.avatar: "http://localhost:9701/images/userDefault.png"} alt="" />
                    <b style={{ fontSize: "1.8vw"}}>{user.nome}</b>
                </div>
                <div className="user-data">
                    <div>
                        <span style={{fontSize: "1.5rem"}}> <AiOutlineMail /> {user.email}</span>
                    </div>
                    <div>
                        <span style={{fontSize: "1.5rem"}}> <BiBookAlt /> {user.course}</span>
                    </div>
                </div>
                <div className="profile-separator"></div>
                <div className="profile-actions">
                    <Button onClick={()=>{editUser(user.email);}} variant="primary" >Editar</Button>
                    <Button onClick={() => {deleteUser(user.email);}} variant="danger" >Apagar</Button>
                </div></>}
                {resError && <Alert variant="danger">{error.message}</Alert>}
                {props.resources && resources && 
                <div className="d-flex justify-content-center align-items-center flex-column mt-5 mb-5">
                    <h5 className="text-dark">Os meus recursos: </h5>
                    
                    <div className="content ">
                    {resources && resources.map((res, idx) => {
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
                    })}
                    </div>
                </div>}
            </div>

            
            {userId != null && <EditProfileModal onSuccess={()=>{setUserId(null); update()}} id={userId} show={editModal} onHide={() => {setUserId(null);setEditModal(false)}}/>}
            <DeleteProfileModal onSuccess={()=>{setDeleteModal(false); localStorage.clear()}} id={userId} show={deleteModal} onHide={() => setDeleteModal(false)} />
        </>
    )
}