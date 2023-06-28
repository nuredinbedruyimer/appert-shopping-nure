import React, { Fragment, useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {  clearError, updateOrder,orderDetails } from "../../Action/orderAction";
import Sidebar from "./Sidebar";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

const ProccessOrder = () => {
  const alert = useAlert();
  const {id} = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { order={},loading,error } = useSelector((state) => state.orderDetails);
  const {shippingInfo,orderItems,totalPrice,orderStatus,user,paymentInfo} = order;
  const {isUpdated} = useSelector((state) => state.order)
  useEffect(() => {
      dispatch(orderDetails(id));
      if(error){
          alert.error(error);
          dispatch(clearError());
      }
      if (isUpdated) {
        alert.success("Order updated Successfully");
        dispatch({ type: UPDATE_ORDER_RESET });
      }
  },[alert, dispatch, error, id, isUpdated])

const shippingInfoDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false
const updateOrderHandler = (id) => {
  const formData = new FormData();
  formData.set("status", status);

  dispatch(updateOrder(id, formData));
};
return (
  <Fragment>
      <MetaData title={`Process Order # ${order && order._id}`}  />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
      {loading ? <Loader /> :(
          <Fragment>
          <div className="row d-flex justify-content-between">
                  <div className="col-12 col-lg-8 mt-5 order-details">

                      <h2 className="my-5">Order # {order._id}</h2>

                      <h4 className="mb-4">Shipping Info</h4>
                      <p><b>Name:</b> {user && user.name}</p>
                      <p><b>Phone:</b>{shippingInfo && shippingInfo.phoneNo}</p>
                      <p className="mb-4"><b>Address:</b>{shippingInfoDetails}</p>
                      <p><b>Amount:</b> ${totalPrice && totalPrice}</p>

                      <hr />

                      <h4 className="my-4">Payment</h4>
                      <p className={isPaid ? "greenColor" : "redColor"} ><b>
                          {isPaid ? "Paid" : "Not Paid"}
                      </b></p>

                      <h4 className="my-4">Stripe ID</h4>
                          <p><b>{paymentInfo && paymentInfo.id}</b></p>


                      <h4 className="my-4">Order Status:</h4>
                      <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ?
                      "greenColor" : "redColor"} ><b>{orderStatus}</b></p>


                      <h4 className="my-4">Order Items:</h4>

                      <hr />
                      <div className="cart-item my-1">
                          {orderItems && orderItems.map((item) => (
                              <div className="row my-5"  key={item.product}>
                                      <div className="col-4 col-lg-2">
                                          <img src={item.image} alt={item.name} height="45" width="65" />
                                      </div>

                                      <div className="col-5 col-lg-5">
                                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                                      </div>


                                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                          <p>${item.price}</p>
                                      </div>

                                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                          <p>{item.quantity} Piece(s)</p>
                                      </div>
                                  </div>
                          ))}
                                  
                      </div>
                      <hr />
                  </div>
                  <div className="col-12 col-lg-3 mt-5">
                                      <h4 className="my-4">Status</h4>
  
                                      <div className="form-group">
                                          <select
                                              className="form-control"
                                              name='status'
                                              value={status}
                                              onChange={(e) => setStatus(e.target.value)}
                                          >
                                              <option value="Processing">Processing</option>
                                              <option value="Shipped">Shipped</option>
                                              <option value="Delivered">Delivered</option>
                                          </select>
                                      </div>
  
                                      <button className="btn btn-primary btn-block"
                                       onClick={() => updateOrderHandler(order._id)}>
                                          Update Status
                                  </button>
                                  </div>
              </div>
      
          </Fragment>
      )}
          </div>
        </div>
      
  </Fragment>
)}

export default ProccessOrder