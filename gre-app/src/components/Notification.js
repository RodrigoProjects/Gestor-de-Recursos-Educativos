import { useHistory } from "react-router"

export default function Notification({data, path}){
    const history = useHistory()

    return (
        <div onClick={data.href ? () => {history.push(path + "/" + data.href)} : () => {}} className="resource-card border border-dark rounded">
        <div className="image-wrapper">
            <img className="resource-image" src={'http://localhost:9702/images/notificationDefault.png'} alt=""/>
        </div>
        <div className="resource-info ml-2">
            <div className="title-autor">
                <h5 className="text-dark">{data.titulo}</h5>
                <small className="text-muted mt-0 ml-1">{data.remetente}</small>
                <p className="mt-1 descricao">{data.descricao}</p>
            </div>
            <div className="type-classificacao">
                <div className="text-muted">{data.tipo}</div>
            </div>
        </div>
        
        </div>
    )
}