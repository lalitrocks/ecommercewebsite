import { Button } from 'bootstrap';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import swal from 'sweetalert';


function Navbar() {
    const navigate = useNavigate();
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    const logout = () => {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            method: "POST",
            body: JSON.stringify(),
            headers: {
                "Accept": "application/json",

                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    localStorage.removeItem('userdetails');
                    swal("success", res.msg)
                    navigate('/login');
                } else if (res.status === 400) {
                    swal("error", res.msg);
                }

            })
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/orderlist">OrderList</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/collection">Collection</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/cart">Cart</NavLink>
                        </li>
                        <li className="nav-item ">
                            <button className="nav-link" onClick={() => logout()}>Logout</button>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar