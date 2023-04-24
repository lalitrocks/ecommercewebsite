import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

function Collection() {
    const [category, setcategory] = useState();
    const [loading, setloading] = useState(false)

    useEffect(() => {

        setloading(true)
        axios.get('/api/getcategory').then(res => {
            if (res.data.status === 200) {
                setloading(false); setcategory(res.data.çatgeory)
            } else if (res.data.status === 400) {
                swal('error', res.data.msg);
            }
        })



    }, [])

    if (loading) {
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div>
                <nav aria-label="breadcrumb " className='bg-warning'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-itemactive ms-5 bg-warning"  aria-current="page">Collection</li>
                    </ol>
                </nav>
                {category && category.map((e, index) => {
                    return (<div key={index} className='card col-md-3'>
                        <img src='' alt={e.name}></img>
                        <Link to={`/collection/${e.slug}`}>
                            <h2>{e.name}</h2>
                        </Link>
                    </div>
                    )


                })}
            </div>

        );

    };

}

export default Collection;