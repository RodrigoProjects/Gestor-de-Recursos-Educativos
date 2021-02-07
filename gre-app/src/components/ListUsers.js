import useFetch from "../utils/useFetch"

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import '../stylesheets/users.css'

import { useState } from 'react';

import { BiSearchAlt, BiBookAlt, BiTimeFive } from "react-icons/bi";
import { AiOutlinePlus, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import CreateUserModal from "../modals/CreateUserModal";
import DeleteUserModal from "../modals/DeleteUserModal";
import EditUserModal from "../modals/EditUserModal";


const jwt = require('jsonwebtoken')

const ListUsers = (props) => {

    
    const [token, setToken] = useState(jwt.sign({}, process.env.REACT_APP_SECRET))
    const {data : users, isPending, error, update} = useFetch("http://localhost:9701/users", token)
    const [search, setSearch] = useState("")
    const [createModal, setCreateModal] = useState(false)
    const [showAlert, setShow] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [userId, setUserId] = useState(null)


    const deleteUser = (email) => {
        setUserId(email)
        setDeleteModal(true);
    }
   
    const editUser = (email) => {
        setUserId(email)
        setEditModal(true);
    }

  return (
    <>  
        <div className="users">
            <div className="action-bar">
                <div>
                    <input type="text" onChange={(e) => setSearch(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                    <span> <BiSearchAlt size={23}/></span>
                </div>
            <Button variant="outline-success" onClick={() => setCreateModal(true)}><AiOutlinePlus size={25} /></Button>
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
                {users && !isPending && users.map((el, idx) => {
                    if((el.nome.includes(search) || el.email.includes(search) || el.tipo.includes(search))){
                        return (
                            <Card key={idx} style={{ width: '18rem', marginBottom: "2vh" }}>
                                <Card.Img className="user-image rounded" variant="top" src={el.avatar ? "http://localhost:9701/avatars/" + el.avatar : "http://localhost:9701/images/userDefault.png"} />
                                <Card.Body style={{marginBottom : "0.5vh"}}>
                                        <Card.Title>{el.nome}</Card.Title>
                                        <div>
                                            <span style={{"font-size": "0.85rem"}}> <AiOutlineMail /> {el.email}</span>
                                        </div>
                                        <div>
                                            <span style={{"font-size": "0.85rem"}}> <AiOutlineLock /> {el.tipo}</span>
                                        </div>
                                        <div>
                                            <span style={{"font-size": "0.85rem"}}> <BiBookAlt /> {el.course}</span>
                                        </div>
                                        <div>
                                            <span style={{"font-size": "0.85rem"}}> <BiTimeFive /> {el.dataDeCriacao}</span>
                                        </div>
                                        
                                    <div className="icons" style={{"margin-top" : "2vh"}}>
                                        <FiEdit3 onClick={()=>{editUser(el.email);}} size={30} className="icon edit-icon"/>
                                        
                                        <FaTimes onClick={() => {deleteUser(el.email);}} size={30} className="icon delete-icon"/>
                                        
                                    </div>
                                   
                                </Card.Body>
                            </Card>
                        )
                    }

                    return ""

                })}
            </div>
        </div>
        
        <CreateUserModal showAlert={() => {setShow(true); update()}} show={createModal} onHide={() => setCreateModal(false)} />
        {userId != null && <EditUserModal onSuccess={()=>{setUserId(null); update(); setShow(true)}} id={userId} show={editModal} onHide={() => {setUserId(null);setEditModal(false)}}/>}
        <DeleteUserModal onSuccess={()=>{setDeleteModal(false); update()}} id={userId} show={deleteModal} onHide={() => setDeleteModal(false)} />
    </>
  )
}

export default ListUsers
