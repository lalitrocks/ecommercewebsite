import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <Link className="nav-link" to="/admin">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Dashboard
                        </Link>
                        <Link className="nav-link" to="categories">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                           Add Categories
                        </Link>
                        <Link className="nav-link" to="products">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                           Add Products
                        </Link>
                        <Link className="nav-link" to="viewcategories">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            View Categories
                        </Link>
                        <Link className="nav-link" to="viewproducts">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            View products
                        </Link>
                        {/* <div className="sb-sidenav-menu-heading">Interface</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse"
                            data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Layouts
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link> */}
                       
                        
                    </div>
                </div>
                <div className="sb-sidenav-footer">
                    <div className="small">Logged in as:</div>
                    Hello admin
                </div>
            </nav>
    
  )
}

export default Sidebar