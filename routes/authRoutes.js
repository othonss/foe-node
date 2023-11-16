const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

// import check auth middleware
const checkAuth = require("../helpers/auth").checkAuth
const checkAuthAdmin = require("../helpers/auth").checkAuthAdmin

router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/register', checkAuth, checkAuthAdmin, AuthController.register)
router.post('/register', checkAuth, checkAuthAdmin, AuthController.registerPost)
router.get('/users', checkAuth, checkAuthAdmin, AuthController.users)
router.post("/users/removeUser", checkAuth, checkAuthAdmin, AuthController.removeUser);
router.get('/logout', AuthController.logout)

module.exports = router
