import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import useFetch from "../utils/useFetch";

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import { FiEdit3 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { useHistory } from "react-router";

import DeleteNoticiaModal from '../modals/DeleteNoticiaModal'
import EditNoticiaModal from '../modals/EditNoticiaModal'

export default function NewsComp({search, setSuccess, success, edit, path}){

    const history = useHistory()

    const [token, _] = useState(localStorage.getItem("token"))
    const {data, isPending, error, update} = useFetch('http://localhost:9702/api/noticias', token)
    const [deleteModal, setDeleteModal] = useState(false)
    const [noticiaId, setNoticiaId] = useState(null)
    const [editModal, setEditModal] = useState(null)
    const [showAlert, setShow] = useState(true);


    useEffect(() => {
        
        if(success){
            update()
            setSuccess()
        }

        return

      }, [success]);

    return(
        <>
            <div className="news-content">
            {localStorage.getItem("created") && showAlert &&  
                    <Alert className="mb-4" variant="success" onClose={() => {setShow(false); localStorage.removeItem("created")}} dismissible>
                        <Alert.Heading>{localStorage.getItem("created")}</Alert.Heading>
                    </Alert>
                    }
                <div className="card">
                    <div className="card-icon">
                        <FaNewspaper size={50}/>
                    </div>
                    
                    <div className="card-body text-dark mt-3">
                        <div className="d-flex flex-column align-items-center mb-3">
                        {isPending && <Spinner animation="border"/>}
                        {error && <Alert variant="danger">{error.message}</Alert>}
                        {data && data.map((res, idx) => {
                            if(res.titulo.includes(search) || res.autor.includes(search)){
                            return (
                                <div key={idx} className="resource-card d-flex justify-content-between align-items-center border border-dark rounded" style={{width: "50rem"}}>
                                    <div onClick={res.href ? () => history.push(path + "/" + res.href) : () => {}} className="image-wrapper" style={res.href ? {cursor: "pointer"} : {}}>
                                        <img className="resource-image" src={res.imagem ? "http://localhost:9702/noticias/" + res.imagem : "http://localhost:9702/images/noticiaDefault.png"} alt=""/>
                                    </div>
                                    <div onClick={res.href ? () => history.push(path + "/" + res.href) : () => {}} className="d-flex flex-column ml-2">
                                        <div className="d-flex title-autor justify-content-center align-items-center">
                                            <h5 className="text-dark">{res.titulo}</h5>
                                            <small className="text-muted mt-0 ml-1">{res.dataDeCriacao.replace('T', ' ').slice(0, -5)}  - {res.autor}</small>
                                            <p className="mt-1 descricao">{res.conteudo}</p>
                                        </div>
                                    </div>
                                    {edit && 
                                        <div className="mr-2">   
                                            <FiEdit3 onClick={()=>{setNoticiaId(res._id); setEditModal(true)}} size={30} className="icon edit-icon mr-2"/>
                                            
                                            <FaTimes onClick={()=>{setNoticiaId(res._id); setDeleteModal(true)}} size={30} className="icon delete-icon"/>
                                        </div>
                                    }
                                    {!edit && <div></div>}
                                    
                                </div>
                                
                            )
                        }})}
                        <DeleteNoticiaModal onSuccess={()=>{setDeleteModal(false); update()}} id={noticiaId} show={deleteModal} onHide={() => setDeleteModal(false)}/>
                        {noticiaId != null && <EditNoticiaModal onSuccess={()=>{setNoticiaId(null); update(); setShow(true)}} id={noticiaId} show={editModal} onHide={() => {setNoticiaId(null);setEditModal(false)}}/>}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}