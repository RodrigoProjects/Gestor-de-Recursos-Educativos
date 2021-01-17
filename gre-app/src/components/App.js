import '../stylesheets/App.css';
import {BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage.js"
import CreatorRouter from "./CreatorRouter.js"
import UserRouter from "./UserRouter.js"
import AdminRouter from "./AdminRouter.js"
import Auth from "../utils/Auth.js"

const jwt = require('jsonwebtoken')



function App() {

  const auth = () => {
    let token = localStorage.getItem("token") 
    let ret = false;
    if(token){
      jwt.verify(token, process.env.REACT_APP_JWT_SCRET, (err, data) => {
        if(!err){
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
          <HomePage />
        </Route>
        <Route path="/user" >
          <Auth comp={<UserRouter />} authorized={auth} /> 
        </Route>
        <Route path="/creator"> 
          <CreatorRouter />
        </Route>
        <Route path="/admin">
          <AdminRouter />
        </Route>
      </Switch>
      {localStorage.getItem("user") ? <Redirect to={JSON.parse(localStorage.getItem("user")).tipo.toLowerCase()} /> : ""}
    </Router>
    
  );
}


export default App;
