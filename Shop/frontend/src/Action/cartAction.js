import {ADD_TO_CART,
    REMOVE_ITEM_CART,
    SAVE_SHIPING_INFO} from '../constants/cartConstants'
import axios from 'axios'
export const addToCart = (id,quantity) => async (dispatch,getState) => {
    const {data} = await axios.get('/api/v1/product/'+id)
        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data.product._id,
                name:data.product.name,
                price:data.product.price,
                image:data.product.images[0].url,
                stock:data.product.stock,
                quantity
            }
        });

        localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems)) 
    
}
   
export const removeItemFromCart = (id) => async (dispatch,getState) => {

        dispatch({
            type: REMOVE_ITEM_CART,
            payload: id
        });

        localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems)) 
    
}
   
export const saveShippingInfo = (data) => (dispatch) => {

    dispatch({
        type: SAVE_SHIPING_INFO,
        payload: data
    });

    localStorage.setItem('shippingInfo',JSON.stringify(data)) 

}
