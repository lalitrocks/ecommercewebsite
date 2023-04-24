import React from 'react'
import { Navigate } from 'react-router-dom';

function Usernotloggedin({children}) {
 
    var userdetails = JSON.parse(localStorage.getItem('userdetails'));
    return !userdetails ? children:<Navigate to={'/'} />
  
}

export default Usernotloggedin