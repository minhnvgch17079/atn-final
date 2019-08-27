const express = require('express')
let router = express.Router()
let cookieParser = require('cookie-parser')
let memberLogin = require('../../controllers/customer/controller-login')

router.use(cookieParser())

router.get('/', memberLogin.checkMemberLogin)
router.post('/', memberLogin.loginProcess)

module.exports = router
