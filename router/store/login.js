require('../../controllers/controller-passport')
const express = require('express')
const router = express.Router()
const passport = require('passport')

let storeAdd = require('./add-product')
router.use('/add', passport.authenticate('jwt-store', {failureRedirect: '/store/login'}), storeAdd)

let storeProduct = require('./list-product')
router.use('/product', passport.authenticate('jwt-store', {failureRedirect: '/store/login'}), storeProduct)

let storeDelete = require('./delete-product')
router.use('/delete', passport.authenticate('jwt-store', {failureRedirect: '/store/login'}), storeDelete)

let storeEdit = require('./edit-product')
router.use('/edit', passport.authenticate('jwt-store', {failureRedirect: '/store/login'}), storeEdit)

let store_ui = require('./store-ui')
router.use('/store-ui', passport.authenticate('jwt-store', {failureRedirect: '/store/login'}) ,store_ui)

let store = require('../../controllers/store/controller-login')
router.get('/login', store.checkStore)
router.post('/login', store.processLogin)
router.get('/', store.checkStore)
module.exports = router