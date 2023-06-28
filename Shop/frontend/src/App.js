import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect,useState } from "react";
import axios from "axios";
import "./App.css";
//import header
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Home from "./components/home";
import ProductDetails from "./components/product/productDetail";

import Cart from "./components/cart/cart";

import Login from "./components/user/login";
import Register from "./components/user/register";
import Profile from "./components/user/profile";
import { loadUser } from "./Action/userAction";
import store from "./store";
import ProtectedRoute from "./components/route/ProtectedRoute";
import AdminProtect from "./components/route/AdminProtect";
import UpdateProfile from "./components/user/updateProfile";
import UpdatePassword from "./components/user/updatePassword";
import ForgotPassword from "./components/user/forgotPassword";
import NewPassword from "./components/user/NewPassword";

import Shipping from "./components/cart/Shipping";
import Confrim from "./components/cart/Confrim";
import OrderSuccess from "./components/cart/OrderSuccess";
import Payment from "./components/cart/Payment";
import ListOrder from "./components/order/ListOrder";
import OrderDetail from "./components/order/OrderDetail";

//import admin
import ProductsList from "./components/admin/ProductsList";
import Dashboard from "./components/admin/Dashboard";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProccessOrder from "./components/admin/Proccessorder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReview from "./components/admin/ProductReview";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Main from "./Main";
import Ano from "./Ano";


function App() {
  const [stripeApiKey,setStripeApiKey] = useState('')
  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripeApiKey(){
      const { data } = await axios.get('api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
          <Routes>
              <Route element={<Main/>}>
                <Route index  element={<Home />} />
                <Route path="/search/:keyword" element={<Home />} />
                <Route path="product/:id" element={<ProductDetails />} exact />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path='/me' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
                <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
                <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}/>
                <Route path="/password/forgot" element={<ForgotPassword />}/>
                <Route path="/password/reset/:token" element={<NewPassword />}/>
                <Route path="/cart" element={<Cart />} />
                <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>}/>
                <Route path="/order/confirm" element={<ProtectedRoute><Confrim /></ProtectedRoute>}/>
                {stripeApiKey &&
                  <Route path="/payment" element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements></ProtectedRoute>}/>
                  }
                <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}/>
                <Route path="/orders/me" element={<ProtectedRoute><ListOrder /></ProtectedRoute>}/>
                <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}/>
              </Route>
              <Route element={<Ano/>}>
                <Route index  element={<Home />} />
                <Route path="/dashboard" element={<AdminProtect><Dashboard /></AdminProtect>}/>
                <Route path="/admin/products" element={<AdminProtect><ProductsList/></AdminProtect>}/>
                <Route path='/admin/product'  element={<AdminProtect><NewProduct/></AdminProtect>}/>
                <Route path='/admin/product/:id'  element={<AdminProtect><UpdateProduct/></AdminProtect>}/>
                <Route path='/admin/orders'  element={<AdminProtect><OrdersList/></AdminProtect>}/>
                <Route path='/admin/order/:id'  element={<AdminProtect><ProccessOrder/></AdminProtect>}/>
                <Route path='/admin/users'  element={<AdminProtect><UsersList/></AdminProtect>}/>
                <Route path='/admin/user/:id'  element={<AdminProtect><UpdateUser/></AdminProtect>}/>
                <Route path='/admin/reviews'  element={<AdminProtect><ProductReview/></AdminProtect>}/>
              </Route>
          </Routes>

        <Footer />
      </div>
    </Router>
  );
}
export default App;
