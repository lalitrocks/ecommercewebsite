import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import swal from 'sweetalert';

function Savepaymenttorazor() {
    const { order_id } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [searchparam, setsearchparam] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const data = {
            order_id,
            payment_intent: searchparam.get('payment_intent'),
            payment_intent_client_secret: searchparam.get('payment_intent_client_secret'),
            redirect_status: searchparam.get('redirect_status')

        }
        axios.post(`/api/saverazorpaymentdetails`, data).then(res => {
            if (res.data.status === 200) {
                swal('success', res.data.msg, "success");
                navigate('/');
            }
        })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h1>
                Saving Payment details</h1>
        </div>
    )
}

export default Savepaymenttorazor;


//http://localhost:3000/?payment_intent=pi_3MyvoYSAt07Q9pdP1h1RnLCQ&payment_intent_client_secret=pi_3MyvoYSAt07Q9pdP1h1RnLCQ_secret_7LvPCHj80QRJKfdJ1RVoIjjrM
// &redirect_status=succeeded