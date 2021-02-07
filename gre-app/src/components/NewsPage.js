import { useState } from "react";
import NewsComp from "./NewsComp";

import { BiSearchAlt} from "react-icons/bi";
import { AiFillPropertySafety, AiOutlinePlus} from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import CreateNoticiaModal from "../modals/CreateNoticiaModal";
import { useHistory } from "react-router";

export default function NewsPage(props){

    const history = useHistory()

    const [showAlert, setShow] = useState(true);
    const [search, setSearch] = useState("")
    const [createModal, setCreateModal] = useState(false)
    const [success, setSuccess] = useState(true)

    return(
        <div className="index-content">
            <div className="action-bar">
                <div>
                    <input type="text" onChange={(e) => setSearch(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                    <span> <BiSearchAlt size={23}/></span>
                </div>
            {props.edit && <Button variant="outline-success" onClick={() => setCreateModal(true)}><AiOutlinePlus size={25} /></Button>}
            </div>
            <div className="separator-users">
            </div>
            <NewsComp path={props.path} edit={props.edit} success={success} search={search} setSuccess={() => setSuccess(false)}/> 
            <CreateNoticiaModal showAlert={() => {setShow(true); setSuccess(true)}} show={createModal} onHide={() => setCreateModal(false)}/>
        </div>
    )
}