import React, { Fragment, useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {  clearError, deleteReview, getProductReviews} from "../../Action/productAction";
import Sidebar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
const ProductReview = () => {
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();
    const [productId,setProductID] = useState('')
    const { reviews, loading, error } = useSelector((state) => state.productReviews);
    const {isDeleted} = useSelector((state) => state.deleteReview)

    useEffect(() => {
      if (error) {
        alert.error(error);
        dispatch(clearError());
      }
      
      if(isDeleted){
        alert.success("Reviews deleted successfully");
        dispatch({type:DELETE_REVIEW_RESET})
      }
    if(productId!==''){
        dispatch(getProductReviews(productId))
    }
    }, [alert, dispatch, error, isDeleted, navigate, productId]);
  
    const deleteReviewHandler = (id) => {
      dispatch(deleteReview(id,productId));
    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(getProductReviews(productId))
    }
  
    const setReviews = () => {
      const data = {
        columns: [
          {
            label: "Review ID",
            field: "Id",
            sort: "asc",
          },
          {
            label: "Reting",
            field: "rating",
            sort: "asc",
          },
          {
            label: "Comment",
            field: "comment",
            sort: "asc",
          },
          {
            label: "User",
            field: "user",
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
      reviews.forEach((element) => {
        data.rows.push({
          Id: (element._id),
          rating: element.ratings,
          comment: element.comment,
          user: element.name,
          Actions: (
              <button className="btn btn-danger  py-1 px-2 ml-2" onClick={() => {deleteReviewHandler(element._id)}}>
                <i className="fa fa-trash"></i>
              </button>
          ),
        });
      });
      return data;
    }
  return (
    <Fragment>
      <MetaData title={"ALL Reviews"} />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <Fragment>
          <div className="row justify-content-center mt-5">
			<div className="col-5">
                            <form onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="productId_field">Enter Product ID</label>
                                    <input
                                        type="text"
                                        id="productId_field"
                                        className="form-control"
                                        value={productId}
                                        onChange={(e) => setProductID(e.target.value)}
                                    />
                                </div>

                                <button
                                    id="search_button"
                                    type="submit"
                                    className="btn btn-primary btn-block py-2"
                                >
                                    SEARCH
								</button>
                            </form>
                        </div>
            
        </div>
        {reviews && reviews.length > 0 ?
           (    <MDBDataTable
                className="px-2"
                striped
                bordered
                hover
                data={setReviews()}
              />
            
        ):(
            <p className="mt-5 text-center">No Reviews</p>
        )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ProductReview