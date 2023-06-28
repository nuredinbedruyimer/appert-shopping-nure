import React, { Fragment, useEffect, useState } from "react";
import "../App.css";
import MetaData from "./layout/metaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Action/productAction";
import Product from "./product/product";
import Loader from "./layout/loader";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

export const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const catagories = [
    "Electronics",
    "Laptops",
    "Acessories",
    "Cameras",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products, error, productCount, resPerPage,filteredProductsCount } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();
  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price, category,rating));
  }, [alert, dispatch, error, currentPage, keyword, price, category,rating]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  let count = productCount
  if(keyword){
    count = filteredProductsCount
  }
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 id="products_heading">Latest Products</h1>
          <MetaData title={"Buy best products"} />
          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{
                          1: "$1",
                          1000: "$1000",
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: "top",
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-3 pl-0">Categories</h4>
                        <ul className="pl-0">
                              {
                                catagories.map((catagory) => (
                                  <li key={catagory} className='pl-0' style={{
                                    cursor:'pointer',
                                    listStyle:'none'}}
                                    onClick={() => setCategory(catagory)}
                                    >
                                    {catagory}
                                  </li>
                            ))}
                        </ul>
                      </div>

                      <hr className="my-3" />
                      <div className="mt-5">
                        <h4 className="mb-3 pl-0">Ratings</h4>
                        <ul className="pl-0">
                              {
                                [5,4,3,2,1].map((star) => (
                                  <li key={star} className='pl-0' style={{
                                    cursor:'pointer',
                                    listStyle:'none'}}
                                    onClick={() => setRating(star)}
                                    >
                                    <div className="rating-outer">
                                    <div className="rating-inner"
                                      style={{
                                        width:`${star*20}%`
                                      }}
                                    >

                                    </div>
                                    </div>
                                  </li>
                            ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>
          {count >= resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productCount}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
export default Home;
