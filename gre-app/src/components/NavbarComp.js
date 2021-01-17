import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import "../stylesheets/navbar.css"
import { useState } from 'react';
import { useHistory } from "react-router-dom";

export default function NavbarComp(props){

    const [activeLink, setActive] = useState(1)
    const history = useHistory()

    return(
        <Navbar bg="dark" variant="dark" className="justify-content-between">
            <Navbar.Brand>
                <img
                    src="/images/logo3.png"
                    width="520"
                    height="80"
                    className="d-inline-block align-top"
                    alt = ""
                />
            </Navbar.Brand>
                {props.items ? 
                    <Nav className="links" activeKey={activeLink}>
                        {props.items.map((el, idx) => {
                           return <Nav.Link key={idx} as="div" className="link" onClick={() => {setActive(idx + 1); history.push(props.path + "/" + el.name)}} eventKey={idx + 1} className="links" href={el.href}>{el.cont}</Nav.Link> 
                        })} 
                    </Nav>
                    :
                    ""
                } 
                {props.welcome}
                {props.buttons}

        </Navbar>
        
    )
}