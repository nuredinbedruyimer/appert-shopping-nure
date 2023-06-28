import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts, clearError, deleteProduct } from "../../Action/productAction";
import Sidebar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductsList = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const {error: deleteError,isDeleted} = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getAdminProducts());
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if(deleteError){
      alert.error(deleteError);
      dispatch(clearError());
    }
    if(isDeleted){
      alert.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch({type:DELETE_PRODUCT_RESET})
    }
  }, [alert, deleteError, dispatch, error, isDeleted, navigate]);

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: " ID",
          field: "Id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "Stock",
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
    products.forEach((element) => {
      data.rows.push({
        Id: (element._id).substring(0, 10)+"...",
        name: element.name,
        price: `${element.price}$`,
        Stock: element.stock,
        Actions: (
          <Fragment>
            <Link
              to={`/admin/product/${element._id}`}
              className="btn btn-primary  py-1 px-2"
              
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button className="btn btn-danger  py-1 px-2 ml-2" onClick={()=>deleteProductHandler(element._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  }
  //setProducts()
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id))
  }
  return (
    <Fragment>
      <MetaData title={"ALL Products"} />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <Fragment>
            <h1 className="mt-5">All Products</h1>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                className="px-2"
                striped
                bordered
                hover
                data={setProducts()}
              />
            )}
          </Fragment>  
        </div>
      </div>
    </Fragment>
  );
};

export default ProductsList;
