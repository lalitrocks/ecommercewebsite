import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom'
import swal from 'sweetalert';
function PublicViewproductdetails() {
    const { product } = useParams();
    const { category } = useParams();

    const [quantity, setquantity] = useState(1)

    const [loading, setloading] = useState(false)
    const [productdetail, setproductdetail] = useState()
    const [categorydetail, setcategorydetail] = useState()
    const [disabled, setdisabled] = useState(false)


// const getquantity = (product_id) =>{
//     axios.get(`/api/getquantity/${product_id}`).then(res => {
//         if (res.data.status === 200) {
//             setmaxquantity(res.data.msg)
//         } else if (res.data.status === 400) {
//             swal('error', res.data.msg, 'error');
//         }
//     })
// }
    const increment = (maxquantity) => {
        if (quantity === maxquantity) {
            setdisabled(true)
        }else{
            setdisabled(false)
        }
        if (quantity < maxquantity) {
            setquantity(prev => prev + 1)
        }
       
    }

    const decrement = (maxquantity) => {
        if (quantity === maxquantity) {
            setdisabled(true)
        }else{
            setdisabled(false)
        }
        if (quantity > 1) {
            setquantity(prev => prev - 1)
        }
    }

    const cart = (qty, product_id) => {
        axios.post(`/api/addtocart/${qty}/${product_id}`).then(res => {
            if (res.data.status === 200) {
                swal('success', res.data.msg);
            } else if (res.data.status === 400) {
                swal('error', res.data.msg, 'error');
            }
        })
    }
    const d = () => {

    }
    useEffect(() => {

        setloading(true)
        axios.get(`/api/viewproductdetailsbyslug/${category}/${product}`).then(res => {

            if (res.data.status === 200) {
                setcategorydetail(res.data.category)
                setproductdetail(res.data.product)
            } else if (res.data.status === 400) {
                swal('error', res.data.msg);
            }
            setloading(false);

        })


// eslint-disable-next-line react-hooks/exhaustive-deps
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
                        <li className="breadcrumb-itemactive ms-5 bg-warning" aria-current="page">Collection/{categorydetail && categorydetail.name}/{productdetail && productdetail.name}</li>
                    </ol>
                </nav>
                {productdetail &&
                    <div className='row'>
                        <div className='col-md-6 col-sm-12'>
                            <img src={`${process.env.REACT_APP_API_URL}/${productdetail.image}`} width={'500px'} alt='product'/>
                        </div>
                        <div className='col-md-6 col-sm-12'>
                            <h1>Product Details</h1>
                            <p>{productdetail.description}</p>
                            Price : <p>{productdetail.selling_price}</p>
                            <h2>number of items</h2>
                            <button type="button"  className="btn btn-primary" onClick={() => decrement(productdetail.quantity)}>-</button>
                            <input type='number' className='p-1' onChange={() => d()} value={quantity} />
                            <button type="button" disabled={disabled?true:false} className="btn btn-primary" onClick={() => increment(productdetail.quantity)}>+</button>
                            <button onClick={() => cart(quantity, productdetail.id)}>add to cart</button><br />
                            <button >add to wishlist</button>
                        </div>
                    </div>
                }



            </div>

        );

    };
}

export default PublicViewproductdetails