import { useState } from "react"
import { useHistory } from "react-router"
import useFetch from "../utils/useFetch"

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import Pedido from './Pedido'


export default function Requests(props) {


    const [token, _] = useState(localStorage.getItem("token"))
    const {data, isPending, error, update} = useFetch("http://localhost:9702/api/pedidos", token)
    const [comment, setComment] = useState("")

    return(
        <div className="pedidos mt-5">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            {data && <>
            <Form.Group>
            <Form.Label>Razão: </Form.Label>
                <Form.Control className="mb-4" style={{width: "40rem"}} onChange={(e) => setComment(e.target.value)} name="comment" type="text"/>
            </Form.Group>
               
                    <div className="pedidos-section mb-3">
                        <h5>Pedidos por analisar:</h5>
                        
                    </div>
                    <div className="pedidos-content">
                            {data.filter(el => el.estado == "Em avaliação").length == 0 && <Alert variant="warning">Sem pedidos pendentes!</Alert>}
                            {data.filter(el => el.estado == "Em avaliação").length > 0 && data.filter(el => el.estado == "Em avaliação").map((el, idx) => {
                                return (
                                    <Pedido set={() => setComment("")} up={() => update()} comment={comment} edit={true} key={idx} path={props.path + "/recursos"} data={el}/>
                                )
                            }) 
                                
                            }
                        </div>
                    <div className="pedidos-section mb-3">
                        <h5>Pedidos confirmados:</h5>
                        
                    </div>
                    <div className="pedidos-content">
                            {data.filter(el => el.estado == "Confirmado").length == 0 && <Alert variant="warning">Sem pedidos confirmados!</Alert>}
                            {data.filter(el => el.estado == "Confirmado").length > 0 && data.filter(el => el.estado == "Confirmado").map((el, idx) => {
                                return (
                                    <Pedido edit={false} key={idx} path={props.path + "/recursos"} data={el}/>
                                )
                            })}
                        </div>
            
                </>
            }
        </div>
    )
}