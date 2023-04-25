import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import swal from 'sweetalert';

function PublicViewproduct() {
    const {slug} = useParams();
    const [loading, setloading] = useState(false)
    const [product, setproduct] = useState()
    const [category, setcategory] = useState()

    useEffect(() => {

        setloading(true)
        axios.get(`/api/viewproductbyslug/${slug}`).then(res => {
            if (res.data.status === 200) {
                setcategory(res.data.category)
                setproduct(res.data.product)
            } else if (res.data.status === 400) {
                swal('error', res.data.msg);
            }
            setloading(false); 

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
                        <li className="breadcrumb-itemactive ms-5 bg-warning"  aria-current="page">Collection/{category && category.name}</li>
                    </ol>
                </nav>
                {product &&product.map((e, index) => {
                    return (<div key={index} className='card col-md-3'>
                        <img src= {`${process.env.REACT_APP_API_URL}/${e.image}`} alt={e.name} width={'300px'}></img>
                        <Link to={`/viewproduct/${category.slug}/${e.slug}`}>
                            <h2>{e.name}</h2>
                        </Link>
                    </div>
                    )


                })}
            </div>

        );

    };

}

export default PublicViewproduct