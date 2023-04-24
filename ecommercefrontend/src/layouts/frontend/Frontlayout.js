import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function Frontlayout() {
  return (
    <div><Navbar />
    <Outlet />
    </div>
  )
}

export default Frontlayout