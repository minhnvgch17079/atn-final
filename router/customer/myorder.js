const express = require('express')
let router = express.Router()
let myorder = require('../../controllers/customer/controller-myorder')

router.get('/', myorder.seeListOrder)

router.get('/:id', myorder.seeDetailOrder)

module.exports = router