import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { productsReducer,productDetailsReducer,newReviewReducer,newProductReducer,productReducer, getReviewReducer,deleteReviewReducer } from './reducers/productReducers';
import { authReducer,userReducer,forgotPasswordReducer,allUsersReducer,userDetailsReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { newOrderReducer,myOrdersReducer,orderDetailsReducer,allOrderReducer,orderReducer } from './reducers/orderReducer';
const reducer = combineReducers({
    products: productsReducer,
    productDetails:productDetailsReducer,
    auth:authReducer,
    user:userReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    product:productReducer,
    allOrder:allOrderReducer,
    order:orderReducer,
    allUsers:allUsersReducer,
    userDetails:userDetailsReducer,
    productReviews:getReviewReducer,
    deleteReview:deleteReviewReducer
})

let initialState = {
    cart:{
        cartItems:localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo:localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
};
const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))
console.log(store.getState())
export default store;