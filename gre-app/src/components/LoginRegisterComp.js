import { useState } from 'react';
import { FaUsers, FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';

const axios = require('axios')

export default function LoginRegisterComp(props){
    const [login, setLogin] = useState({email : "", password: ""})

    const sign_in = () => {
        if(login.email.trim() != "" && login.password.trim() != ""){

        }
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
                            <h3 className="mt-2 mb-3 login-title display-5">
                                Bem-vindo:
                            </h3>
                            <form className="login-form">
                                <div className="form-group mt-3">
                                    <label className="login-label" for="email"> 
                                        Email:
                                    </label>
                                    <input onChange={(e => setLogin({...login, email: e.target.value}))} size={50} type="email" className="form-control input-login" id="email" placeholder="john@example.com" />
                                </div>
                                <div className="form-group mt-3">
                                    <label className="login-label" for="password"> 
                                        Password:
                                    </label>
                                    <input onChange={(e => setLogin({...login, password: e.target.value}))} size={50} type="password" className="form-control input-login" id="password" placeholder="Very secret word..." />
                                </div>
                            </form>
                            <div className="login-buttons">
                                <button className="btn btn-outline-success mt-5 login-button">
                                    Login
                                </button>
                                <button className="btn btn-outline-primary mt-5 register-button">
                                    Registar
                                </button>
                            </div>
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
        </> 
    )
}