import React from 'react'
import { Navigate } from 'react-router-dom';

function Ismailverified({children}) {
    var userdetails = JSON.parse(localStorage.getItem('userdetails'));

 
    return userdetails.email_verified_at ? children:<Navigate to={'/verifymail'} />
  
}




function Ismailnotverified({children}) {
    var userdetails = JSON.parse(localStorage.getItem('userdetails'));

 
    return userdetails.email_verified_at ? <Navigate to={'/login'} />:children
  
}


export  {Ismailverified,Ismailnotverified};
