import React from 'react'
import { Navigate } from 'react-router-dom'

function Privateroute({children}) {
 var userdetails = JSON.parse(localStorage.getItem('userdetails'));
  return userdetails ? children:<Navigate to={'/login'} />
    
}

export default Privateroute;