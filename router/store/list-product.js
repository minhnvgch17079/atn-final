const express = require('express')
const router = express.Router()
let store = require('../../controllers/store/controller-list-product')

router.get('/', store.showProduct)

module.exports = router