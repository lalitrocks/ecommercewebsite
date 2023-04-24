import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../../assets/admin/css/styles.css'
import '../../assets/admin/js/scripts'
import { Outlet } from 'react-router-dom'

function Master() {

    
    return (
        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">

                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>

                <div id="layoutSidenav_content">
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </div>

            </div>
        </div>
    )
}

export default Master