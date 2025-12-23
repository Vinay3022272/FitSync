import express from "express"
import { login, logout, onboard, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.post("/onboarding", protectRoute , onboard)

// otp-verification mail
// forget-password
// send-resest-password-email

// check if user is logged in or not
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
    console.log("Requested User", req.user);
})

export default router


// router.get("/",(req, res) => {
//     res.send("Hello World23738448")
// })