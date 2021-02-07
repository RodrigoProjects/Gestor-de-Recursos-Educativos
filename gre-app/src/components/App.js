import '../stylesheets/App.css';
import {BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage.js"
import CreatorRouter from "./CreatorRouter.js"
import UserRouter from "./UserRouter.js"
import AdminRouter from "./AdminRouter.js"
import Auth from "../utils/Auth.js"

const jwt = require('jsonwebtoken')

require('dotenv').config()


function App( props ) {

  const auth = (usertype) => {
    let token = localStorage.getItem("token") 

    let ret = false;

    if(token){
      jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, data) => {
        if(!err && data.tipo == usertype){
          ret = true

        } else if(!err && data.tipo !== usertype){
          ret = false
        } else {
          localStorage.clear()
        }
        
      })

    }

    return ret
  }

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {localStorage.getItem('token') && localStorage.getItem("user") ? <Redirect to={JSON.parse(localStorage.getItem("user")).tipo.toLowerCase()} /> : <HomePage />}
        </Route>
        <Route path="/user" >
          <Auth comp={<UserRouter path="/user" />} authorized={() => auth("User")} /> 
        </Route>
        <Route path="/creator"> 
          <Auth comp={<CreatorRouter path="/creator"/>} authorized={() => auth("Creator")} /> 
        </Route>
        <Route path="/admin">
          <Auth comp={<AdminRouter path="/admin" />} authorized={() => auth("Admin")} /> 
        </Route>
      </Switch>
    </Router>
    
  );
}


export default App;
