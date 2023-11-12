const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

// import check auth middleware
const checkAuth = require("../helpers/auth").checkAuth;

router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/register', checkAuth, AuthController.register)
router.post('/register', checkAuth, AuthController.registerPost)
router.get('/users', checkAuth, AuthController.users)
router.post("/remove", checkAuth, AuthController.removeUser);
router.get('/logout', AuthController.logout)

module.exports = router
