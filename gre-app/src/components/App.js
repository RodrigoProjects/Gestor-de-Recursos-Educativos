import '../stylesheets/App.css';
import {BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage.js"
import CreatorRouter from "./CreatorRouter.js"
import UserRouter from "./UserRouter.js"
import AdminRouter from "./AdminRouter.js"
import Auth from "../utils/Auth.js"

const jwt = require('jsonwebtoken')



function App( props ) {

  const auth = () => {
    let token = localStorage.getItem("token") 

    let ret = false;

    if(token){
      jwt.verify(token, process.env.REACT_APP_JWT_SCRET, (err, data) => {
        if(!err){
          console.log("Im here")
          ret = true
        } 
      })

    }

    return ret
  }

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {localStorage.getItem('token') && localStorage.getItem("user") ? <Redirect to={JSON.parse(localStorage.getItem("user")).tipo.toLowerCase()} /> : ""}
          <HomePage />
        </Route>
        <Route path="/user" >
          <Auth comp={<UserRouter />} authorized={auth} /> 
        </Route>
        <Route path="/creator"> 
          <Auth comp={<CreatorRouter path="/creator"/>} authorized={auth} /> 
        </Route>
        <Route path="/admin">
          <Auth comp={<AdminRouter path="/admin" />} authorized={auth} /> 
        </Route>
      </Switch>
    </Router>
    
  );
}


export default App;
