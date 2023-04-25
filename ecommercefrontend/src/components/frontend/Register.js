import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
function Register() {
    const [formData, setformData] = useState({
        userName: "",
        password: "",
        confirmPassword: "",
        name: "",
        errorList: [

        ]
    });

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    const login = (e) => {
        e.preventDefault();
        navigate('/login');
    }
    const submithandler = async (e) => {
        e.preventDefault();
        const data = {
            userName: formData.userName,
            name: formData.name,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        await fetch(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })
        await fetch(`${process.env.REACT_APP_API_URL}/register`, {
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
                    // localStorage.setItem('userdetails',JSON.stringify(res.user));
                    swal("success", res.msg);
                    navigate('/login');
                } else if (res.status === 404) {
                    setformData({ ...formData, errorList: res.Validationerrors });
                } else if (res.status === 400) {
                    swal("error", res.msg);
                }

            })
    }


    return (
        <div>
            <div className='container py-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Register</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={(event) => submithandler(event)}>
                                    <div className='form-group mb-3'>
                                        <label>Full Name</label>
                                        <input type='text' name='name' value={formData.name} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["name"]}</span>
                                    </div>
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
                                        <label>Confirm Password</label>
                                        <input type='text' name='confirmPassword' value={formData.confirmPassword} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span id=''>{formData.errorList["confirmPassword"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <button className='btn btn-primary' type='submit'>Register</button>
                                        <h6>Already have an account <a style={{cursor:'pointer'}} onClick={(event)=>login(event)}>Login</a></h6>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;