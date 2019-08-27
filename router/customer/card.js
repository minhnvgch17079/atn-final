const express = require('express')
/* const passport = require('passport')
const cookieParser = require('cookie-parser') */
let router = express.Router()
let card = require('../../controllers/customer/controller-card')

/* router.use(cookieParser())
router.use(passport.initialize())
router.use(passport.session()) */


router.get('/', card.seeCard)

router.get('/:id', card.addToCard)

router.get('/delete/:id', card.deleteProductInCard)

router.get('/order/ok', card.makeOrderFromCard)
module.exports = router