import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

function Orderlist() {

    const [loading, setloading] = useState(false);
    const [totalorder, settotalorder] = useState({});
    useEffect(() => {
        setloading(true);
        axios.get(`/api/getallorder`).then(res => {
            if (res.data.status === 200) {
                settotalorder(res.data.orderitems)

            } else if (res.data.status === 400) {
                swal('Empty', res.data.msg,'error');
            }
            setloading(false);

        })


    }, [])




    var order = "";

    if (totalorder.length > 0) {
        order = <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table style={{ border: "2px solid black", borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ border: "2px solid black", padding: '25px' }} >
                        <th style={{ border: "2px solid black", padding: '25px' }}>Product Name</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Product Image</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Quantity</th>
                        <th style={{ border: "2px solid black", padding: '25px' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {totalorder && totalorder.map((e,index) =>{
                        return(
                            <tr style={{ border: "2px solid black" }} key={index}>
                                <td style={{ border: "2px solid black" }}>{e.name}</td>
                                <td style={{ border: "2px solid black" }}><img width={'150px'} alt='order' height={'150px'} src={`${process.env.REACT_APP_API_URL}/${e.image}`} /></td>
                                <td style={{ border: "2px solid black" }}>{e.qty}</td>
                                <td style={{ border: "2px solid black" }}>{e.price}</td>
                            </tr>)
                            })
                    
                        }
                </tbody>

            </table>
        </div>
    } else {
        order = <div className='row'>
            <div className='col-md-3 ms-auto p-5 me-auto border border-dark-subtle'>
                You haven`t made any order
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
                {order}
            </div>
        )
    }
}

export default Orderlist