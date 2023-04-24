import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';


function Checkout() {

    var grandtotal = 0;
    const client_secret = useRef("");
    const [passqwordconfirmed, setpassqwordconfirmed] = useState(false)
    const [formData, setformData] = useState({
        first_name: "",
        last_name: "",
        full_address: "",
        email: "",
        phone_number: "",
        pincode: "",
        city: "",
        state: "",
        confirmpasswordbeforepayment: "",
        errorList: []
    });
    // const [clientSecret, setclientSecret] = useState("")
    const [loading, setloading] = useState(false);
    const [cartitem, setcartitem] = useState([]);
    const stripe = useStripe();
    const [stripeloading, setstripeloading] = useState()
    const [errorMessage, seterrorMessage] = useState()
    const elements = useElements();
    const navigate = useNavigate();
    var restockproducts = [];

    useEffect(() => {
        setloading(true);

        async function fetchdata() {
            await axios.get(`/api/getcartdetail`).then(res => {
                if (res.data.status === 200) {
                    setcartitem(res.data.item)

                } else if (res.data.status === 400) {
                    swal('Please add item to cart', res.data.msg);
                }
                setloading(false);

            })
        }

        fetchdata();



    }, [])


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

    const handleError = (error) => {
        setstripeloading(false);
        seterrorMessage(error.message);
    }

    function removediv() {
        const model = document.getElementById('exampleModal');
        const body = document.getElementsByTagName('body')[0];
        model.classList.remove('show');
        model.style.display = "none";
        body.classList.remove('model-open');
        body.style.overflow = "";
        body.style.paddingRight = "";
        var array = document.getElementsByClassName("modal-backdrop");
        for (let index = 0; index < 2; index++) {
            array[0].remove();

        }
    }

    const confirmPassword = async (e) => {
        console.log(44);
        e.preventDefault();
        const data = {
            confirmpasswordbeforepayment: formData.confirmpasswordbeforepayment
        }
        axios.post(`/api/confirmpassword`, data).then(res => {
            if (res.data.status === 200) {
                setpassqwordconfirmed(true);
                removediv()
                swal('success','now you can place the order');
            } else if (res.data.status === 400) {
                swal('error', res.data.msg, 'error')
            } else if (res.data.status === 404) {
                setformData({ ...formData, errorList: res.data.Validationerrors });
            }
        })

    }

    const submithandler = async (e, mode) => {
        e.preventDefault();

        if (passqwordconfirmed) {
            // axios.get(`/api/stripe/${grandtotal}`).then(res => {
            //     if (res.data.status === 200) {
            //         // setclientSecret(res.data.client_secret)
            //         client_secret.current = res.data.client_secret;
            //     }
            // })

            const data = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                full_address: formData.full_address,
                email: formData.email,
                pincode: formData.pincode,
                phone_number: formData.phone_number,
                city: formData.city,
                state: formData.state,
                payment_mode: mode,
                payment_id: "",
                stripe_payment_status: ""
            };


            switch (mode) {
                case 'cod':
                    fetch('http://localhost:8000/api/makepayment', {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Accept": "application/json",
                            "X-XSRF-TOKEN": xsrftoken()
                        },
                        credentials: 'include'
                    }).then(res => res.json())
                        .then(res => {
                            if (res.status === 200) {
                                setformData({ ...formData, errorList: [] });
                                navigate('/thankyou');
                                swal("success", res.msg);

                            } else if (res.status === 404) {
                                setformData({ ...formData, errorList: res.Validationerrors });
                            } else if (res.status === 400) {
                                swal("Error", res.msg);
                            }

                        })
                    break;
                case 'razorpay':

                    fetch('http://localhost:8000/api/validateform', {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Accept": "application/json",
                            "X-XSRF-TOKEN": xsrftoken()
                        },
                        credentials: 'include'
                    }).then(res => res.json())
                        .then(res => {
                            if (res.status === 200) {

                                setformData({ ...formData, errorList: [] });
                                var options = {
                                    "key": "rzp_test_YJ45FnJOEKjRhL", // Enter the Key ID generated from the Dashboard
                                    "amount": grandtotal / 10, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                                    "currency": "INR",
                                    "name": "Lalit website", //your business name
                                    "description": "Test Payment",
                                    "image": "https://example.com/your_logo",
                                    "handler": function (response) {
                                        data.payment_id = response.razorpay_payment_id;
                                        fetch('http://localhost:8000/api/makepayment', {
                                            method: "POST",
                                            body: JSON.stringify(data),
                                            headers: {
                                                "Accept": "application/json",
                                                "X-XSRF-TOKEN": xsrftoken()
                                            },
                                            credentials: 'include'
                                        }).then(res => res.json())
                                            .then(res => {
                                                if (res.status === 200) {
                                                    setformData({ ...formData, errorList: [] });
                                                    navigate('/thankyou');
                                                    swal("success", res.msg);
                                                } else if (res.status === 400) {
                                                    swal("Error", res.msg);
                                                }

                                            })

                                    },
                                    "prefill": {
                                        "name": formData.first_name, //your customer's name
                                        "email": formData.email,
                                        "contact": formData.phone_number
                                    },
                                    "notes": {
                                        "address": "Razorpay Corporate Office"
                                    },
                                    "theme": {
                                        "color": "#3399cc"
                                    }
                                };
                                var rzp1 = new window.Razorpay(options);
                                rzp1.open();
                                // navigate('/thankyou');
                                // swal("success", res.msg);

                            } else if (res.status === 404) {
                                setformData({ ...formData, errorList: res.Validationerrors });
                            } else if (res.status === 400) {
                                swal("Error", res.msg);
                            }

                        })



                    break;
                case 'stripe':
                    fetch('http://localhost:8000/api/validateform', {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Accept": "application/json",
                            "X-XSRF-TOKEN": xsrftoken()
                        },
                        credentials: 'include'
                    }).then(res => res.json())
                        .then(res => {
                            if (res.status === 200) {
                                setformData({ ...formData, errorList: [] });
                                if (!stripe) {
                                    // Stripe.js has not yet loaded.
                                    // Make sure to disable form submission until Stripe.js has loaded.
                                    swal('error', 'internal server error')
                                } else {

                                    const { error: submitError } = elements.submit();
                                    if (submitError) {
                                        handleError(submitError);

                                    } else {
                                        data.stripe_payment_status = "pending";
                                        fetch('http://localhost:8000/api/makepayment', {
                                            method: "POST",
                                            body: JSON.stringify(data),
                                            headers: {
                                                "Accept": "application/json",
                                                "X-XSRF-TOKEN": xsrftoken()
                                            },
                                            credentials: 'include'
                                        }).then(res => res.json())
                                            .then(res => {
                                                if (res.status === 200) {
                                                    setformData({ ...formData, errorList: [] });
                                                    const { error } = stripe.confirmPayment({
                                                        elements,
                                                        clientSecret: client_secret.current,
                                                        confirmParams: {
                                                            return_url: `http://localhost:3000/savepaymenttorazor/${res.order_id}`,
                                                        },
                                                    }).then(function (result) {

                                                        if (result.error) {

                                                            restockproducts.map(e => {
                                                                axios.post(`/api/restockafterstripefailure`, {
                                                                    order_id: res.order_id,
                                                                    product_id: e.product_id,
                                                                    quantity: e.quantity
                                                                }).then(res => {
                                                                    if (res.data.status === 404) {
                                                                        console.log('error');
                                                                    }
                                                                })
                                                            })
                                                            swal("failed transcation", 'please try again', 'error')

                                                            // Inform the customer that there was an error.
                                                        }
                                                    });
                                                    if (error) {
                                                        // This point is only reached if there's an immediate error when
                                                        // confirming the payment. Show the error to your customer (for example, payment details incomplete)
                                                        swal('error', "Please retry payment", 'error');

                                                    }
                                                } else if (res.status === 400) {
                                                    swal("Error", res.msg);
                                                }

                                            });

                                    }

                                }

                                // swal('Checking Verification', 'redirecting.....');
                            } else if (res.status === 404) {
                                setformData({ ...formData, errorList: res.Validationerrors });
                            } else if (res.status === 400) {
                                swal("Error", res.msg);
                            }

                        })



                    break;
                default:
                    break;
            }
        } else {
            const model = document.getElementById('exampleModal');
            const body = document.getElementsByTagName('body')[0];
            model.classList.add('show');
            model.style.display = "block";
            body.classList.add('model-open');
            body.style.overflow = "hidden";
            body.style.paddingRight = "14px";
            body.insertAdjacentHTML('beforeend', "<div class='modal-backdrop fade show'></div>");
            body.insertAdjacentHTML('beforeend', "<div class='modal-backdrop fade show'></div>");
        }
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

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <form onSubmit={(event) => confirmPassword(event)}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm your password to process order</h1>
                                    <button type="button" onClick={removediv} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <label>Enter your password</label>
                                    <input type='text' name='confirmpasswordbeforepayment' value={formData.confirmpasswordbeforepayment} onChange={(event) => changeHandler(event)} className='form-control' />
                                    <span>{formData.errorList["confirmpasswordbeforepayment"]}</span>


                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={removediv} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Confirm password</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='row'>
                    {/* form */}
                    <div className='col-7'>
                        <div className='card ms-3 p-3 mt-5'>
                            <form >
                                <div className='row'>
                                    <div className='form-group col-md-6  mb-3'>
                                        <label>First Name</label>
                                        <input type='text' name='first_name' value={formData.first_name} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["first_name"]}</span>
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label>Last Name</label>
                                        <input type='text' name='last_name' value={formData.last_name} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["last_name"]}</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label>Phone Number</label>
                                        <input type='number' name='phone_number' value={formData.phone_number} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["phone_number"]}</span>
                                    </div>
                                    <div className='form-group col-md-6 mb-3'>
                                        <label>Email address</label>
                                        <input type='email' name='email' value={formData.email} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["email"]}</span>
                                    </div>
                                </div>
                                <div className='form-group  mb-3'>
                                    <label>Full address</label>
                                    <input type='text' name='full_address' value={formData.full_address} onChange={(event) => changeHandler(event)} className='form-control' />
                                    <span>{formData.errorList["full_address"]}</span>
                                </div>
                                <div className='row'>
                                    <div className='form-group col-md-4  mb-3'>
                                        <label>City</label>
                                        <input type='text' name='city' value={formData.city} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["city"]}</span>
                                    </div>
                                    <div className='form-group col-md-4  mb-3'>
                                        <label>State</label>
                                        <input type='text' name='state' value={formData.state} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["state"]}</span>
                                    </div>
                                    <div className='form-group  col-md-4 mb-3'>
                                        <label>Zipcode</label>
                                        <input type='number' name='pincode' value={formData.pincode} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["pincode"]}</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='ms-auto me-auto col-md-6'>
                                        <button className='col-md-6' onClick={(event) => submithandler(event, 'cod')}> Cod Order</button>
                                        <button className='col-md-6' onClick={(event) => submithandler(event, 'razorpay')} > Razorpay</button>


                                    </div>
                                </div>
                                <div className='row mt-4 '> <h2 className='text-center'>or pay via Stripe</h2></div>
                                <div className='row'>
                                    <PaymentElement />
                                    <div className='col-md-4 me-auto ms-auto'>
                                        <button className='col-md-12 mt-2' onClick={(event) => submithandler(event, 'stripe')} disabled={!stripe || stripeloading}>Pay Via Stripe</button>
                                        {errorMessage && <div>{errorMessage}</div>}
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>


                    {/* table */}
                    <div className='col-5'>
                        <table className='mt-5' style={{ border: "2px solid black", borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ border: "2px solid black", padding: '25px' }} >
                                    <th style={{ border: "2px solid black", padding: '25px' }}>ID</th>
                                    <th style={{ border: "2px solid black", padding: '25px' }}>Product Name</th>
                                    <th style={{ border: "2px solid black", padding: '25px' }}>Quantity</th>
                                    <th style={{ border: "2px solid black", padding: '25px' }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartitem && cartitem.map((e, index) => {
                                    grandtotal += Math.floor(e.selling_price * e.quantity);

                                    restockproducts.push({
                                        product_id: e.product_id,
                                        quantity: e.quantity
                                    });
                                    return (
                                        <tr style={{ border: "2px solid black" }} key={index}>

                                            <td style={{ border: "2px solid black" }}>{e.id}</td>
                                            <td style={{ border: "2px solid black" }}>{e.name}</td>
                                            <td style={{ border: "2px solid black" }}>{e.quantity}</td>
                                            <td style={{ border: "2px solid black" }}>{e.selling_price * e.quantity}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={6}><h4 style={{ float: 'right' }}>GRAND TOTAL: RS {grandtotal}</h4>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                    </div>

                </div>
            </div>
        )
    }
}

export default Checkout