import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Viewproduct() {
    const navigate = useNavigate();
const [loading, setloading] = useState(true)
const [allpreoduct, setallpreoduct] = useState({})
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
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewproduct`, {
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
                    setallpreoduct(res.allproducts);
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }
            })
    }, [])

const deletecat = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/deleteproduct/${id}`, {
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
            } else if (res.status === 400) {
                swal("Error", res.msg);
            } else if (res.status === 410) {
                swal("Not An Admin", res.msg);
            }

        })
}
    if (loading) {
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table style={{ border: "2px solid black", borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ border: "2px solid black", padding: '25px' }} >
                        <th style={{ border: "2px solid black", padding: '25px' }}>ID</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Name</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Image</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Category</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Featured</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Populard</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Status</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Edit</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {allpreoduct && allpreoduct.map((e, index) => <tr style={{ border: "2px solid black" }} key={index}>
                        <td style={{ border: "2px solid black" }}>{e.id}</td>
                        <td style={{ border: "2px solid black" }}>{e.name}</td>
                        <td style={{ border: "2px solid black" }}><img src={`${process.env.REACT_APP_API_URL}/${e.image}`} width={'50px'}></img></td>

                        <td style={{ border: "2px solid black" }}>{e.category_id}</td>
                        <td style={{ border: "2px solid black" }}>{e.featured}</td>
                        <td style={{ border: "2px solid black" }}>{e.popular}</td>

                        <td style={{ border: "2px solid black" }}>{e.status}</td>
                        <td style={{ border: "2px solid black" }}><Link to={`/admin/editproduct/${e.id}`} >Edit</Link></td>
                        <td style={{ border: "2px solid black" }}><button onClick={() => deletecat(e.id)}>Delete</button></td>
                    </tr>)
                    }
                </tbody>
            </table>
        </div>
        )
    }
}

export default Viewproduct