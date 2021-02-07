import NavbarComp from "./NavbarComp.js"
import { Route, Switch, useHistory, Redirect, Link } from "react-router-dom";

import { CgFeed } from "react-icons/cg";
import { FiUsers, FiLogOut } from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";
import { BsListTask} from "react-icons/bs";

import Button from 'react-bootstrap/Button';

import ListUsers from './ListUsers'
import ListResources from './ListResources'
import ResourceDetails from './ResourceDetails'
import NewsPage from './NewsPage'

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
                buttons={<Link to="/"><Button onClick={() => {localStorage.clear(); history.push('/')}} variant="dark" > <FiLogOut size="1.5vw" style={{color: "white"}} /> </Button></Link>}
            />
            <Switch>
                <Route path={props.path} exact>
                    <Redirect to={props.path + '/recursos'} />
                </Route>
                <Route path={props.path + "/utilizadores"} >
                    <ListUsers />
                </Route>
                <Route path={props.path + "/noticias"}>
                    <NewsPage edit={true}/>
                </Route>
                <Route path={props.path + "/recursos"} exact>
                    <ListResources type="" path={props.path + "/recursos"}/>
                </Route>
                <Route path={props.path + "/recursos/:id"}>
                    <ResourceDetails edit={true} path={props.path + "/recursos"}/>
                </Route>
            </Switch>
        </>
    )
}