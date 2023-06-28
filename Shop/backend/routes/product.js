const express = require("express")
const router = express.Router()

const {getProducts,
    newProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteProduct,createReview,getReviews,deleteReview,getAdminProducts
}  = require("../controllers/productController")

const {isAuthenticatedUser,authorizeRoles} = require("../middlewares/auth")

router.route("/products").get(getProducts)
router.route("/admin/products").get(getAdminProducts)
router.route("/product/:id([0-9a-fA-F]{24})").get(getSingleProduct)

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)
router.route("/admin/product/:id([0-9a-fA-F]{24})")
    .put(isAuthenticatedUser,authorizeRoles('admin'),updateSingleProduct)
    .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)

router.route("/review").put(isAuthenticatedUser,createReview)
router.route("/reviews").get(getReviews,isAuthenticatedUser)
                        .delete(isAuthenticatedUser,deleteReview)

module.exports = router;