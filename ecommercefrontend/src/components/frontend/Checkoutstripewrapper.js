import React from 'react'
import { Elements } from '@stripe/react-stripe-js';
import Checkout from './Checkout';
import getStripe from './getstripe';
function Checkoutstripewrapper() {
    const loadstripe =getStripe();
    const options = {
        mode: 'payment',
        amount: 1099,
        currency: 'inr',
        payment_method_types:['card'],
        // Fully customizable with appearance API.
        appearance: {/*...*/},
      };
    return (
        <Elements stripe={loadstripe} options={options}>
            <Checkout />
        </Elements>

    )
}

export default Checkoutstripewrapper