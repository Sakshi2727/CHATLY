const express=require('express')
const router=express.Router()
const {registerUser, authUser, allusers}=require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
// .post(registerUser): This chainable method defines a handler for HTTP POST requests to the specified path ('/'). It’s calling the registerUser function when a POST request is made to this route.When a POST request is made to '/', execute the registerUser function.
router.route('/').post(registerUser).get(protect,allusers)
router.post('/login',authUser)
module.exports=router