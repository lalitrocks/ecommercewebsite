import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51MpcCGSAt07Q9pdPDWygvN7LbBbIJd1f0dPDvOmBr5UvUm6sTdRGsi3862WgRSDnSQ2lYyeOUjfOstzXbXtABEOS00o6qIhFpw");
  }
  return stripePromise;
};

export default getStripe;