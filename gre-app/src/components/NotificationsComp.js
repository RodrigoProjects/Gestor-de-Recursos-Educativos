import useFetch from "../utils/useFetch"

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from "react";

import Notification from './Notification'

export default function Notifications({path}){

    const userS =  JSON.parse(localStorage.getItem("user"))

    const [token, setToken] = useState(localStorage.getItem("token"))
    const {data, isPending, error} = useFetch('http://localhost:9702/api/notificacoes/' + userS.email, token)


    return (
        <div className="notifications mt-4">
            {isPending && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error.message}</Alert>}
            <div className="notifications-container" style={{width: "80%"}}>
                {data && data.map((el, idx) => {
                    console.log(el)
                    return <Notification path={path} key={idx} data={el} />
                })}
            </div>
            
        </div>
    )
}