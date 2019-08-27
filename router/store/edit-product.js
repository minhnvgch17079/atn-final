const express = require('express')
let router = express.Router()
let store = require('../../controllers/store/controller-edit-product')

router.get('/:id', store.showFormEdit)
router.post('/:id', store.processEdit)

module.exports = router