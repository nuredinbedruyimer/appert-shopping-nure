const express = require("express")
const router = express.Router()
const {registerUser,loginUser, 
    logoutUser, forgotPassword,
     resetPassword,getUserProfile,
    updatePassword,updateProfile,
    getAllUsers,getSingleUser,
    updateUser,deleteUser
} = require("../controllers/userController")
    
const {isAuthenticatedUser,authorizeRoles}= require("../middlewares/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserProfile)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,getAllUsers,authorizeRoles("admin"))
router.route("/admin/user/:id")
            .get(isAuthenticatedUser,getSingleUser,authorizeRoles("admin"))
            .put(isAuthenticatedUser,updateUser,authorizeRoles("admin"))
            .delete(isAuthenticatedUser,deleteUser,authorizeRoles("admin"))

module.exports = router