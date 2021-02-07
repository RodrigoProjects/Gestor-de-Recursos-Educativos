import NavbarComp from "./NavbarComp.js"
import { Route, Switch, Link, Redirect, useHistory } from "react-router-dom";

import { CgFeed } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";
import { BsListTask} from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

import Button from 'react-bootstrap/Button';

import UserProfile from './UserProfile'
import ListResources from './ListResources'
import ResourceDetails from './ResourceDetails'
import NewsPage from "./NewsPage.js";
import Notifications from "./NotificationsComp.js";

export default function CreatorPage(props){
    const history = useHistory()

    return(
        <>
            <NavbarComp 
            path={props.path}
            items={
                [
                    {name: "recursos" , cont: <span>Recursos <CgFeed /></span>, href : `${props.path}/recursos` },
                    {name: "noticias", cont: <span>Notícias <FaRegNewspaper /></span>, href : `${props.path}/noticias` },
                    {name: "notificacoes", cont: <span>Notificacões <BsListTask /></span>, href : `${props.path}/notificacoes` },
                    {name: "perfil", cont: <span>Perfil <AiOutlineUser /></span>, href : `${props.path}/perfil`}
                ]
            }
            welcome={<span className="welcome">{"Bem-vindo " + JSON.parse(localStorage.getItem("user")).nome + "!"}</span>}
            buttons={<Link to="/"><Button onClick={() => {localStorage.clear(); history.push('/')}} variant="dark" > <FiLogOut size="1.5vw" style={{color: "white"}} /> </Button></Link>}
        />
        <Switch>
            <Route path={props.path} exact>
                <Redirect to={props.path + '/recursos'} />
            </Route>
            <Route path={props.path + "/noticias"}>
                <NewsPage />
            </Route>
            <Route path={props.path + "/perfil"} >
                <UserProfile path={props.path + "/recursos"} resources={true}/>
            </Route>
            <Route path={props.path + "/recursos"} exact>
                <ListResources type="/publicos" path={props.path + "/recursos"}/>
            </Route>
            <Route path={props.path + "/recursos/:id"}>
                <ResourceDetails edit={false} path={props.path + "/recursos"}/>
            </Route>
            <Route path={props.path + "/notificacoes"}>
                <Notifications path={props.path}/>
            </Route>
        </Switch>
        </>
        
    )
}