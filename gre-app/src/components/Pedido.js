import { useHistory } from "react-router"
import useFetch from "../utils/useFetch"

import { FaCheck, FaTimes } from "react-icons/fa"

export default function Pedido({data, path, edit, comment, up, set}){

    const history = useHistory()

    const {data: res, isPending, error} = useFetch("http://localhost:9702/api/recursos?id=" + data.recurso_id, localStorage.getItem("token"))


    const acceptRequest = () => {

        fetch('http://localhost:9702/api/pedidos/' + data._id + "?token=" + localStorage.getItem("token"), {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                estado: "Confirmado",
                recurso_id: data.recurso_id
            })
        }).then(res => {
            if(res.ok){
                up()
                set()
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const declineRequest = () => {
        if(comment != ""){
            fetch('http://localhost:9702/api/pedidos/' + data._id + "?token=" + localStorage.getItem("token"), {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                estado: "Recusado",
                comentario: comment,
                recurso_id: data.recurso_id
            })
        }).then(res => {
            if(res.ok){
                up()
                set()
            }
        }).catch(e => {
            console.log(e)
        })


        }
        
    }

    return (<>
        {res && 
        <div className="resource-card d-flex justify-content-between align-items-center border border-dark rounded mb-4" style={{width: "60rem"}}>
            <div onClick={() => history.push(path + "/" + data.recurso_id)} className="image-wrapper" style={{cursor: "pointer"}}>
                <img className="resource-image" src={res.imagem ? "http://localhost:9702/images/" + res.imagem : "http://localhost:9702/images/defaultResource.png"} alt=""/>
            </div>
            <div onClick={() => history.push(path + "/" + data.recurso_id)} className="d-flex flex-column ml-2">
                <div className="d-flex title-autor justify-content-center align-items-center">
                    <h5 className="text-dark">{res.titulo}</h5>
                    <small className="text-muted mt-0 ml-1">{res.dataDeCriacao.replace('T', ' ').slice(0, -5)}  - {res.autor}</small>
                    <p className="mt-1 descricao">{res.conteudo}</p>
                </div>
            </div>
            {edit && 
            <div>
                <FaCheck onClick={acceptRequest} className="mr-2" size="1.5rem" style={{color: "green"}}/>
                <FaTimes onClick={declineRequest} className="mr-1" size="1.5rem" style={{color: "red"}}/>
            </div>
            
            }
            {!edit && 
            <div></div>}
        
    </div>}
    </>
    )
}