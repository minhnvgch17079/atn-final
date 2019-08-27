const express = require('express')
const router = express.Router()
let store = require('../../controllers/store/controller-add-product')

router.get('/', store.showFormAddProduct)
router.post('/', store.processAddProduct)

module.exports = router