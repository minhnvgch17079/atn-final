require('./controllers/controller-passport')
const passport = require('passport')
const express = require('express')
const app = express()
const compression = require('compression')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')

app.listen(process.env.PORT || 3000)

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(cookieParser())
app.use(expressSession({
    secret: '!$44f!!%^^!FFFFAQFACK',
    saveUninitialized: true
}))
app.use(compression())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())

let facebook = require('./controllers/customer/controller-login')
let register = require('./router/customer/register') 
let login = require('./router/customer/login')
let logout = require('./router/logout')
let store = require('./router/store/login')
let card = require('./router/customer/card')
let myorder = require('./router/customer/myorder')
let admin = require('./router/admin/admin')
let index = require('./controllers/controller-index')
let products = require('./api/routes/products')
app.use('/register', register)
app.use('/login', login)
app.use('/logout', logout)
app.use('/store', store)
app.use('/card', passport.authenticate('jwt-customer', {failureRedirect: '/login'}), card)
app.use('/myorder', passport.authenticate('jwt-customer', {failureRedirect: '/login'}), myorder)
app.use('/admin', admin)
app.use('/api/products', products)

app.get('/', index.showProductAsPage) //SHOW PRODUCT PAGE 1,2,3,... DEPEND ON USER CHOSSEN
app.post('/', index.searchProduct)
app.get('/:id', index.seeStore) //SEE ALL PRODUCT OF 1 STORE THAT CUSTOMER CHOICE

/* app.get('/auth/facebook',
  passport.authenticate('facebook')); */

app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }), facebook.facebook);

app.use((req, res) => {
    res.end('Not Found')
})
