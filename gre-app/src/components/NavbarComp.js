import Navbar from 'react-bootstrap/Navbar';

export default function NavbarComp(props){
    return(
        <Navbar bg="dark" className="justify-content-between">
            <Navbar.Brand>
                <img
                    src="images/logo3.png"
                    width="520"
                    height="80"
                    className="d-inline-block align-top"
                    alt = ""
                />
            </Navbar.Brand>

        </Navbar>
        
    )
}