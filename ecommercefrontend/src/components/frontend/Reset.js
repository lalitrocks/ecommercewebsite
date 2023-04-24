import React, { useState } from 'react'
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
        await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' })

        await fetch('http://localhost:8000/checkmailexist', {
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
                    fetch('http://localhost:8000/api/forgot-password', {
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
    console.log(formdata);
    return (
        <div><form onSubmit={(event) => submithandler(event)}>
            <label>Enter your email</label>
            <input type='email' name='email' value={formdata.email} onChange={(event) => changehandler(event)} />
            <span >{formdata.errorList.email}</span>
            <button>Send password Link</button>
        </form>
        </div>
    )
}

export default Reset