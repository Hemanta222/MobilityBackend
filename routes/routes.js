const express = require("express");
const router = express.Router();
const UserCon = require("../controller/UserCon");
const { verifyAccessToken } = require("../helper/jwt");
router.post("/check-auth", verifyAccessToken, UserCon.checkAuth);
router.post("/login", UserCon.postLogin);
router.post("/signup", UserCon.postSignup);

module.exports = router;
