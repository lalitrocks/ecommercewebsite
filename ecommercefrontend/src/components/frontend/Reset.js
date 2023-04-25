import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

function Reset() {
    const [formdata, setformdata] = useState({
        email: "",
        errorList: []
    })
    const changehandler = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
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
    const submithandler = async (e) => {
        e.preventDefault();
        const data = {
            email: formdata.email

        }
        await fetch(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })

        await fetch(`${process.env.REACT_APP_API_URL}/checkmailexist`, {
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
                    fetch(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
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
                                swal("success", "password reset link has been sent to your mail account");
                            }

                        })
                } else if (res.status === 404) {
                    setformdata({ ...formdata, errorList: res.validationerrors })
                } else if (res.status === 400) {
                    swal('user not found', res.msg, 'error')
                }

            })
    }
    return (
        <div className='row justify-content-center mt-5'>
            <div className='col-sm-6 col-6 justify-center'>
                <div className="card ">
                    <div className="card-body">
                        <form onSubmit={(event) => submithandler(event)}>
                            <label>Enter your email</label><br></br>
                            <input type='email' name='email' value={formdata.email} onChange={(event) => changehandler(event)} />
                            <span >{formdata.errorList.email}</span><br/>
                            <button>Send password Link</button><br/>
                            Back to :<Link to={'login'}>Login</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reset