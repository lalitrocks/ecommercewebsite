import React from 'react'
import { Navigate } from 'react-router-dom';

function Isuseradmin({children}) {
    var userdetails = JSON.parse(localStorage.getItem('userdetails'));

 
    return userdetails.role_as ? children:<Navigate to={'/login'} />
  
}

export default Isuseradmin