const express = require('express')
const router = express.Router()
const register = require('../../controllers/customer/controller-register')

router.get('/', (req, res) => {
    res.render('register')
})
router.post('/', register.processRegister)

module.exports = router