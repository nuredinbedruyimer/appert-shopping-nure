import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {  clearError, allOrders, deleteOrder } from "../../Action/orderAction";
import Sidebar from "./Sidebar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrdersList = () => {
    const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.allOrder);
  const {isDeleted} = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(allOrders());
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    
    if(isDeleted){
      alert.success("order deleted successfully");
      navigate("/admin/orders");
      dispatch({type:DELETE_ORDER_RESET})
    }
  }, [alert, dispatch, error, isDeleted, navigate]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  }

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "Id",
          sort: "asc",
        },
        {
          label: "No of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "Actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    orders.forEach((element) => {
      data.rows.push({
        Id: (element._id).substring(0, 10)+"...",
        numOfItems: element.orderItems.length,
        amount: `${element.totalPrice}$`,
        status: element.orderStatus && String(element.orderStatus).includes('Delivered') ?
                <p style={{color: 'green'}}>{element.orderStatus}</p> : <p style={{color: 'red'}}>{element.orderStatus}</p>,
                
        Actions: (
          <Fragment>
            <Link
              to={`/admin/order/${element._id}`}
              className="btn btn-primary  py-1 px-2"
              
            >
              <i className="fa fa-eye"></i>
            </Link>
            <button className="btn btn-danger  py-1 px-2 ml-2" onClick={() =>{deleteOrderHandler(element._id)}}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  }
  return (
    <Fragment>
      <MetaData title={"ALL Orders"} />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <Fragment>
            <h1 className="mt-5">All Orders</h1>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                className="px-2"
                striped
                bordered
                hover
                data={setOrders()}
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default OrdersList