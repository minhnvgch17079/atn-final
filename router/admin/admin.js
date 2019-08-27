require('../../controllers/controller-passport')
const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
let router = express.Router()
let controller_admin = require('../../controllers/admin/controller-admin')
let admin_login = require('../../controllers/admin/controller-login')
let admin_confirm_order = require('../../controllers/admin/controller-order')
let admin_confirm_product = require('../../controllers/admin/controller-product')

router.use(cookieParser())
router.use(passport.initialize())
router.use(passport.session())

router.get('/login', admin_login.checkAdminLogin) //IF ADMIN LOGINED, SHOW ADMIN UI, IF NOT SHOW LOGIN FORM
router.post('/login', admin_login.loginAdmin)
router.get('/', admin_login.checkAdminLogin)

router.get('/processorder', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), admin_confirm_order.processCustomerOrder) // PROCESS CUSTOMER ORDER
router.get('/adminmyorder/:id', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), admin_confirm_order.seeDetailOrder) //SEE CUSTOMER ORDER DETAIL

router.post('/refuse', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), admin_confirm_product.refuse) //REFUSE PRODUCT
router.get('/product', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), admin_confirm_product.confirmProduct) //CONFIRM PRODUCT

router.get('/:id', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), controller_admin.adminUI) //MANAGEMENT UI FOR ADMIN AND MANAGE STORE ACCOUNT
router.post('/:id', passport.authenticate('jwt-admin', {failureRedirect: '/admin/login'}), controller_admin.statistics) // SHOW STATISTICS OF EACH STORE


module.exports = router