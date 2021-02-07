import { useState } from 'react';
import { FaUsers, FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

import { Redirect } from 'react-router';

import RegisterModal from '../modals/RegisterModal'

const jwt = require('jsonwebtoken')
const axios = require('axios')

export default function LoginRegisterComp(props){
    const [login, setLogin] = useState({email : "", password: "", loading: false})
    const [error, setError] = useState("")
    const [user, setUser] = useState({})
    const [showRegister, setShowRegister] = useState(false)
    const [showAlert, setShow] = useState(false);

    const sign_in = (e) => {
        e.preventDefault()
        setLogin({...login, loading: true})

        if(login.email.trim() !== "" && login.password.trim() !== ""){

            axios.post("http://localhost:9701/users/login", {email: login.email, password: login.password}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt.sign({}, process.env.REACT_APP_SECRET)
                    
                }
            }).then(dados => {
                
                localStorage.setItem("token", dados.data.token)

                let user = jwt.decode(dados.data.token)

                localStorage.setItem("user", JSON.stringify(user))

                setError("")
                setLogin({...login, loading: false})
                
                setUser(user)
                
            }).catch(e => {
                if(e.response){
                    e.response.status === 401 ? setError("Credenciais inválidas!") : setError("Erro no servidor, por favor tente mais tarde.")
                }
                setLogin({...login, loading: false})
            })
        } else {
            setError("Email e Password são necessários!")
            setLogin({...login, loading: false})
        }
    }

    if(user.tipo){
        return (<Redirect to={user.tipo.toLowerCase()} />)
    }

    return( 
        <>
            <div className="login mr-2">
                <div className="card">
                    <div className="card-icon">
                        <FaUsers size={50}/>
                    </div>
                    <div className="card-body text-dark mt-3">
                        <div className="card-content">
                            {error ? <Alert variant="danger" >{error}</Alert> : ""}
                            {localStorage.getItem("created") && showAlert &&  
                                <Alert variant="success" onClose={() => {setShow(false); localStorage.removeItem("created")}} dismissible>
                                    <Alert.Heading>{localStorage.getItem("created")}</Alert.Heading>
                                </Alert>
                                }
                            <h3 className="mt-2 mb-3 login-title display-5">
                                Bem-vindo:
                            </h3>
                            <form  onSubmit={sign_in} className="login-form">
                                <div className="form-group mt-3">
                                    <label className="login-label" htmlFor="email"> 
                                        Email:
                                    </label>
                                    <input onChange={(e => setLogin({...login, email: e.target.value}))} size={50} type="email" className="form-control input-login" id="email" placeholder="john@example.com" />
                                </div>
                                <div className="form-group mt-3">
                                    <label className="login-label" htmlFor="password"> 
                                        Password:
                                    </label>
                                    <input onChange={(e => setLogin({...login, password: e.target.value}))} size={50} type="password" className="form-control input-login" id="password" placeholder="Very secret word..." />
                                </div>
                                <div className="login-buttons">
                                <button type="submit" className="btn btn-outline-success mt-5 login-button">
                                    {login.loading ? <Spinner animation="grow" variant="success" /> : "Login"}
                                </button>
                                <Button onClick={() => setShowRegister(true)} variant="outline-primary" className="mt-5 register-button">
                                    Registar
                                </Button>
                            </div>
                            </form>
                           
                            <div className="login-separator">
                                <div className="separator-icon" > 
                                    Registar com
                                </div>
                            </div>
                            <div className="register-buttons mb-3">
                                <FaGithub size={33} className="github" />
                                <FaGoogle size={33} className="google" />
                                <FaTwitter size={33} className="twitter" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RegisterModal showAlert={() => {setError(null) ;setShow(true)}} show={showRegister} onHide={() => setShowRegister(false)} />
        </> 
    )
}