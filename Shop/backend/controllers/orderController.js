const Order  = require('../models/order');
const Product = require('../models/products');

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')

//create new order 
exports.newOrder = catchAsyncError(async(req, res,next)=>{
    const neworder = {...req.body,paidAt:Date.now(),user:req.user._id} 
    const order = await Order.create(neworder)
    res.status(200).json({
        success: true,
        order
    })
})
//get order by id
exports.getOrderById = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email')
    if (!order){
        return next(new ErrorHandler('this is invalid id order',404));
    }
    res.status(200).json({
       success: true,
       order
       })
    })
//get logged in user orders
exports.getOrders = catchAsyncError(async(req, res, next)=>{
    const orders = await Order.find({user: req.user._id})
    res.status(200).json({
        success: true,
        orders
    })
})
//get all orders for admin
exports.adminOrders = catchAsyncError(async(req, res, next)=>{
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order => totalAmount += order.totalPrice)
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})
// update process order Admin
exports.updateOrder = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler('This order has already been delivered',404))
        }
    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json({
        success: true
    })
})
async function updateStock(id,quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({
        validateBeforeSave: false
    })
}
//delete order
exports.deleteOrder = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findByIdAndDelete(req.params.id)
    if(!order){
        return next(new ErrorHandler('Order not found',400))
    }
    res.status(200).json({
        success: true
    })
})