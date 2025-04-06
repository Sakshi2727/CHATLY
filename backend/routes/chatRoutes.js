const express=require('express')
const { protect } = require('../middleware/authMiddleware')
const { accessChat,fetchChats,creategroupchat,rename, removefromgroup, addtogroup } = require('../controllers/chatControllers')
const router=express.Router()
router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChats)
router.route("/group").post(protect,creategroupchat)
router.route("/rename").put(protect,rename)
router.route("/delete").put(protect,removefromgroup)
router.route("/groupadd").put(protect,addtogroup)

module.exports=router