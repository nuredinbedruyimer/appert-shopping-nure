const express = require("express")
const router = express.Router()
const {newOrder,getOrderById,getOrders,adminOrders,updateOrder,deleteOrder} = require("../controllers/orderController")
const {isAuthenticatedUser,authorizeRoles} = require("../middlewares/auth")


router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getOrderById)
router.route("/orders/me").get(isAuthenticatedUser,getOrders)
router.route("/admin/orders").get(isAuthenticatedUser,adminOrders,authorizeRoles("admin"))
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
                                .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports = router