import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Cart() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [cartitem, setcartitem] = useState([]);
    useEffect(() => {
        setloading(true)
        axios.get(`/api/getcartdetail`).then(res => {
            if (res.data.status === 200) {
                setcartitem(res.data.item)

            } else if (res.data.status === 400) {
                swal('Please add item to cart', res.data.msg);
            }
            setloading(false);

        })


    }, [])
    const d = () => {

    }
    const RemoveItem = (cart_id) => {
        axios.get(`/api/deletecartitem/${cart_id}`).then(res => {
            if (res.data.status === 200) {
                navigate(0);
                swal('success', res.data.msg);
            } else if (res.data.status === 400) {
                swal('error', res.data.msg);
            }
        })

    }
    const increment = (e) => {

        setcartitem(prev => prev.map(item =>{ if (e === item.id) {
            if (item.quantity < item.product_quantity) {
                handleincdecintable(e, 'inc')
                return { ...item, quantity: item.quantity + 1 }
            }
            return item;

        } else {
            return item;
        }}
        ))
    }
    const decrement = (e) => {
        setcartitem(prev => prev.map(item => {
            if (e === item.id) {
                if (item.quantity > 1) {
                    handleincdecintable(e, 'dec')
                    return { ...item, quantity: item.quantity - 1 }
                }
                return item;

            } else {
                return item;
            }
        }
        ))
    }

    const handleincdecintable = (cart_id, method) => {
        axios.get(`/api/incdeccart/${cart_id}/${method}`)
    }
    var grandtotal = 0;
    var itemincart = "";
    if (cartitem.length > 0) {
        itemincart = <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table style={{ border: "2px solid black", borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ border: "2px solid black", padding: '25px' }} >
                        <th style={{ border: "2px solid black", padding: '25px' }}>ID</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Product Name</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Product Image</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Quantity</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Price</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {cartitem && cartitem.map((e, index) => {
                        grandtotal += Math.floor(e.selling_price * e.quantity);
                        return (
                            <tr style={{ border: "2px solid black" }} key={index}>

                                <td style={{ border: "2px solid black" }}>{e.id}</td>
                                <td style={{ border: "2px solid black" }}>{e.name}</td>
                                <td style={{ border: "2px solid black" }}><img src={`${process.env.REACT_APP_API_URL}/${e.image}`} width={'200px'} /></td>
                                <td style={{ border: "2px solid black" }}>
                                    <button type="button" className="btn btn-primary" onClick={() => decrement(e.id)}>-</button>
                                    <input type='number' className='p-1' onChange={() => d()} value={e.quantity} />
                                    <button type="button" className="btn btn-primary" onClick={() => increment(e.id)}>+</button>

                                </td>
                                <td style={{ border: "2px solid black" }}>{e.selling_price * e.quantity}</td>
                                <td style={{ border: "2px solid black" }}><button onClick={() => RemoveItem(e.id)}>Remove</button></td>
                            </tr>
                        )
                    })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6}><h1 style={{ float: 'left' }}>GRAND TOTAL: RS {grandtotal}</h1>
                            <Link to={'/checkout'}>
                                <button style={{ float: 'right' }} className='mt-3'>Proceed to payment</button>
                            </Link></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    } else {
        itemincart = <div className='row'>
            <div className='col-md-3 ms-auto p-5 me-auto border border-dark-subtle'>
                No Item Present In your cart
            </div>
        </div>
    }


    if (loading) {
        return (
            <div>
                loading
            </div>
        )
    } else {
        return (
            <div>
                <nav aria-label="breadcrumb " className='bg-warning'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-itemactive ms-5 bg-warning" aria-current="page"> cart</li>
                    </ol>
                </nav>

                {itemincart}
            </div>
        )
    }


}

export default Cart