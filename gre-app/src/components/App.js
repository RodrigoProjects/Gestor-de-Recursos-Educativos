import '../stylesheets/App.css';
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage.js"
import CreatorRouter from "./CreatorRouter.js"
import UserRouter from "./UserRouter.js"
import AdminRouter from "./AdminRouter.js"
import Auth from "../utils/Auth.js"

require('dotenv').config()
const jwt = require('jsonwebtoken')

const auth = () => {
  let token = localStorage.getItem("token") 
  if(token){
    jwt.verify(token, process.env.REACT_APP_JWT_SCRET, (err, data) => {
      if(err){
        return false
      }

      return true
    })
  } else {
    return false
  }
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/user" >
          <Auth comp={<UserRouter />} auth={auth} /> 
        </Route>
        <Route path="/creator"> 
          <CreatorRouter />
        </Route>
        <Route path="/admin">
          <AdminRouter />
        </Route>
      </Switch>
    </Router>
    
  );
}


export default App;
