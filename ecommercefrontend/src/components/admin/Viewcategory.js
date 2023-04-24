import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom'


function Viewcategory() {
    const navigate = useNavigate();
    const [allcategory, setallcategory] = useState([]);
    const [loading, setloading] = useState(false);
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    useEffect(() => {
        setloading(true);
        fetch('http://localhost:8000/api/admin/viewcategory', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                setloading(false);
                if (res.status === 200) {
                    setallcategory(res.allCategory);
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }

            })

    }, []);

    const deletecat = (id) => {
        fetch(`http://localhost:8000/api/admin/deletecategory/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                setloading(false);
                if (res.status === 200) {
                    swal("Success", res.msg);
                    navigate(0);
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }

            })
    }

    if (loading) {
        return (
            <h1>Loading</h1>
        )
    }
    else {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <table style={{ border: "2px solid black", borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ border: "2px solid black", padding: '25px' }} >
                                <th style={{ border: "2px solid black", padding: '25px' }}>ID</th>
                                <th style={{ border: "2px solid black", padding: '25px' }}>Name</th>
                                <th style={{ border: "2px solid black", padding: '25px' }}>Slug</th>
                                <th style={{ border: "2px solid black", padding: '25px' }}>Status</th>
                                <th style={{ border: "2px solid black", padding: '25px' }}>Edit</th>
                                <th style={{ border: "2px solid black", padding: '25px' }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allcategory && allcategory.map((e, index) => <tr style={{ border: "2px solid black" }} key={index}>
                                <td style={{ border: "2px solid black" }}>{e.id}</td>
                                <td style={{ border: "2px solid black" }}>{e.name}</td>
                                <td style={{ border: "2px solid black" }}>{e.slug}</td>
                                <td style={{ border: "2px solid black" }}>{e.status}</td>
                                <td style={{ border: "2px solid black" }}><Link to={`/admin/editcategory/${e.id}`} >Edit</Link></td>
                                <td style={{ border: "2px solid black" }}><button onClick={() => deletecat(e.id)}>Delete</button></td>
                            </tr>)
                            }
                        </tbody>
                    </table>
                </div></div>
        )

    }



}

export default Viewcategory