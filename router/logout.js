const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
    res.clearCookie('token')
    req.logOut()
    res.redirect('/')
})
module.exports = router