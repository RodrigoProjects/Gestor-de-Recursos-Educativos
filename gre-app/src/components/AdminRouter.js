import NavbarComp from "./NavbarComp.js"
import { useHistory } from "react-router-dom";

import { CgFeed } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";
import { BsListTask} from "react-icons/bs";


export default function AdminPage(props){
    const history = useHistory()



    return(
        <>
            <NavbarComp 
                path={props.path}
                items={
                    [
                        {name: "recursos" , cont: <span>Recursos <CgFeed /></span>, href : `${props.path}/recursos` },
                        {name: "utilizadores", cont: <span>Utilizadores <FiUsers /></span>, href : `${props.path}/utilizadores` },
                        {name: "noticias", cont: <span>Notícias <FaRegNewspaper /></span>, href : `${props.path}/noticias` },
                        {name: "pedidos", cont: <span>Pedidos <BsListTask /></span>, href : `${props.path}/pedidos` } 
                    ]
                }
                welcome={<span className="welcome">{"Bem-vindo " + JSON.parse(localStorage.getItem("user")).nome + "!"}</span>}
            />
        </>
    )
}