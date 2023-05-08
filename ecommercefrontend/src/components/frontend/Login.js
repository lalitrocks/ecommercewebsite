import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';

function Login() {
    const { msg } = useParams();
    const [formData, setformData] = useState({
        userName: "",
        password: "",
        errorList: []
    });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    }
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    const resgiter = (e) => {
        e.preventDefault();
        navigate('/register');
    }
    const reset = (e) => {
        e.preventDefault();
        navigate('/reset');
    }
    const submithandler = async (e) => {
        e.preventDefault();
        const data = {
            userName: formData.userName,
            password: formData.password,
        };
        await fetch(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })
        await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Accept": "application/json",

                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    // localStorage.setItem('auth-token', res.token)
                    // console.log(res)
                    setformData({ ...formData, errorList: [] });
                    localStorage.setItem('userdetails', JSON.stringify(res.user));
                    swal("success", res.msg);
                    navigate('/');
                } else if (res.status === 404) {
                    setformData({ ...formData, errorList: res.Validationerrors });
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                }

            })
    }

    var alert = "";
    if (msg === 'success') {
        alert = <div className="alert alert-warning alert-dismissible fade show" role="alert"> <strong>Success</strong> Your password reset successfully<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>;
    }else if(msg === 'failed'){
        alert = <div className="alert alert-warning alert-dismissible fade show" role="alert"><strong>Opps </strong> Your password does not reset succesfully. Please try Again<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>;
    }
    return (
        <div className='container py-5'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4>Login</h4>
                        </div>
                        <div className='card-body'>
                            { alert && alert}
                            <form onSubmit={(event) => submithandler(event)}>
                                <div className='form-group mb-3'>
                                    <label>User Name</label>
                                    <input type='text' name='userName' value={formData.userName} onChange={(event) => changeHandler(event)} className='form-control' />
                                    <span>{formData.errorList["userName"]}</span>
                                </div>
                                <div className='form-group mb-3'>
                                    <label>Password</label>
                                    <input type='text' name='password' value={formData.password} onChange={(event) => changeHandler(event)} className='form-control' />
                                    <span>{formData.errorList["password"]}</span>
                                </div>
                                <div className='form-group mb-3'>
                                    <button className='btn btn-primary' type='submit'>Login</button>
                                    <h6>Dont have an account?<button style={{ cursor: 'pointer' }} onClick={(event) => resgiter(event)}>Register</button></h6>
                                    <h6>Forgot your password?<button  style={{ cursor: 'pointer' }} onClick={(event) => reset(event)}>Reset</button></h6>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login