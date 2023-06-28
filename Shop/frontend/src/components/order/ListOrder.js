import React, { Fragment, useEffect} from "react";
import { Link } from "react-router-dom";
import {MDBDataTable} from 'mdbreact';
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrders,clearError } from "../../Action/orderAction";

const ListOrder = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { orders,loading,error } = useSelector((state) => state.myOrders);
    useEffect(() => {
        dispatch(myOrders());
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
    },[alert, dispatch, error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'Id',
                    sort: 'asc', 
                },
                {
                    label: 'Number of Items',
                    field: 'NumberOfItems',
                    sort: 'asc',
                },
                {
                    label: 'amount',
                    field: 'amount',
                    sort: 'asc',
                },
                {
                    label: 'Status',
                    field: 'Status',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'Actions',
                    sort: 'asc',
                }
            ],
            rows:[]
        }
        orders.forEach(element => {
            data.rows.push({
                Id: element._id,
                NumberOfItems: element.orderItems.length,
                amount: `${element.totalPrice}$`,
                Status: element.orderStatus && String(element.orderStatus).includes('delivered') ?
                <p style={{color: 'green'}}>{element.orderStatus}</p> : <p style={{color: 'red'}}>{element.orderStatus}</p>,
                Actions: <Link to={`/order/${element._id}`} className="btn btn-primary">
                <i className="fa fa-eye"></i></Link>
            })
        })
    return data;    
    };
  return (
    <Fragment>
        <MetaData title='my orders' />
        <h1 className='my-5'>My Orders</h1>
        {loading ? <Loader /> : (
            <MDBDataTable
                data={setOrders()}
                className='px-3'
                bordered
                striped
                hover 
            />
        )}
    </Fragment>
  )
}

export default ListOrder