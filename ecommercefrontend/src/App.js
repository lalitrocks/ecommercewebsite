import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import Master from './layouts/admin/Master';
import Home from './components/frontend/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './components/frontend/Login';
import Register from './components/frontend/Register';
import Frontlayout from './layouts/frontend/Frontlayout';
import Privateroute from './Privateroute';
import Usernotloggedin from './Usernotloggedin';
import Categories from './components/admin/Categories';
import Isuseradmin from './Isuseradmin';
import Viewcategory from './components/admin/Viewcategory';
import Editcategory from './components/admin/Editcategory';
import Products from './components/admin/Products';
import Viewproduct from './components/admin/Viewproduct';
import Editproduct from './components/admin/Editproduct';
import Collection from './components/frontend/Collection';
import axios from 'axios';
import PublicViewproduct from './components/frontend/PublicViewproduct';
import PublicViewproductdetails from './components/frontend/PublicViewproductdetails';
import Cart from './components/frontend/Cart';
import Checkoutstripewrapper from './components/frontend/Checkoutstripewrapper';
import Savepaymenttorazor from './components/frontend/Savepaymenttorazor';
import swal from 'sweetalert';
import Orderlist from './components/frontend/Orderlist';
import Reset from './components/frontend/Reset';
import Verifyemail from './components/frontend/Verifyemail';
import  { Ismailnotverified,Ismailverified } from './Ismailverified';
import Updateuser from './components/frontend/Updateuser';
axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.withCredentials = true;
function App() {
  const navigate = useNavigate();
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    let [resource, config] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    if (response.status === 401) {
      localStorage.removeItem('userdetails');
      swal("session expired", 'please login again')
      navigate('login')
    }
    return response;
  };
  axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      localStorage.removeItem('userdetails');
      swal("session expired", 'please login again')
      navigate('login')
    };
    return Promise.reject(error);
  });
  return (
    <div>
      <Routes>

        <Route path='/login/:msg?' element={<Usernotloggedin><Login /></Usernotloggedin>} />
        <Route path='/register' element={<Usernotloggedin><Register /></Usernotloggedin>} />
        <Route path='*' element={<Usernotloggedin><Login /></Usernotloggedin>} />
        <Route path='/reset' element={<Usernotloggedin><Reset /></Usernotloggedin>} />
        <Route path='/verifymail' element={<Privateroute ><Ismailnotverified><Verifyemail /></Ismailnotverified></Privateroute>} />
        <Route path='/updateuser' element={<Privateroute ><Updateuser /></Privateroute>} />


        {/* normal user route */}
        <Route path='/' element={<Privateroute ><Ismailverified><Frontlayout /></Ismailverified></Privateroute >} >
          <Route index element={<Home />} />
          <Route path='/orderlist' element={<Orderlist />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/collection/:slug' element={<PublicViewproduct />} />
          <Route path='/viewproduct/:category/:product' element={<PublicViewproductdetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkoutstripewrapper />} />
          <Route path='/savepaymenttorazor/:order_id' element={<Savepaymenttorazor />} />

        </Route>

        {/* admin routes */}
        <Route path='/admin' element={<Privateroute ><Isuseradmin><Ismailverified><Master /></Ismailverified></Isuseradmin></Privateroute>} >
          <Route index element={<Dashboard />} />
          <Route path='/admin/categories' element={<Categories />} />
          <Route path='/admin/products' element={<Products />} />

          <Route path='/admin/viewcategories' element={<Viewcategory />} />
          <Route path='/admin/viewproducts' element={<Viewproduct />} />

          <Route path='/admin/editcategory/:id' element={<Editcategory />} />
          <Route path='/admin/editproduct/:id' element={<Editproduct />} />

          {/* <Route path='*' element={<Navigate to='/admin' />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
