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


const jwt = require('jsonwebtoken')

const ListUsers = (props) => {
    
    const {data : users, isPending, error} = useFetch("http://localhost:9701/users", jwt.sign({}, process.env.REACT_APP_SECRET))
    const [search, setSearch] = useState("")
    const [createModal, setCreateModal] = useState(false)

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

            </div>
            <div className="content">
                {isPending && <Spinner animation="border"/>}
                {error && <Alert variant="danger">{error.message}</Alert>}
                {users && users.map(el => {
                    if(search && el.nome.includes(search) || el.email.includes(search) || el.tipo.includes(search)){
                        return (
                            <Card style={{ width: '18rem' }}>
                                <Card.Img className="user-image" variant="top" src={el.avatar ? el.avatar : "http://localhost:9701/images/userDefault.png"} />
                                <Card.Body>
                                    <Card.Text>
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
                                        
                                    </Card.Text>
                                    <div className="icons">
                                        <FiEdit3 size={30} className="icon edit-icon"/>
                                        <FaTimes size={30} onClick={(e) => console.log("Okey")} className="icon delete-icon"/>
                                    </div>
                                   
                                </Card.Body>
                            </Card>
                        )
                    }

                })}
            </div>
        </div>
        
        <CreateUserModal show={createModal} onHide={() => setCreateModal(false)} />
    </>
  )
}

export default ListUsers
