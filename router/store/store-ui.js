const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('store-ui', {
        store: req.user.username
    })
})

module.exports = router