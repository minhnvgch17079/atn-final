const {check, validationResult} = require('express-validator')
const client = require('../../pg')
const jwt = require('jsonwebtoken')
module.exports.processLogin = [
    check('username').not().isEmpty().withMessage('Please In Put Your UserName')
        .isLength({max: 25}).withMessage('Length Of User Name Limits By 25 Characters'),
    check('password').not().isEmpty().withMessage('Please Input Your Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Characters'),
    (req, res) => {
    sess = req.session
    let q = req.body
    let username = q.username
    let password = q.password
    let errors = validationResult(req)
    if(errors.isEmpty()) {
        let sql = "SELECT * FROM store WHERE username = '"+username+"'"
        client.query(sql, (err, result) => {
            if(password == result.rows[0].password) {
                let token = jwt.sign({id: result.rows[0].id}, 'store')
                res.cookie('token', token)
                res.redirect('/store/store-ui')
            } else {
                res.render('store-login', {
                    result: 'Wrong username or password'
                })
            }         
        })
    }else {
        res.render('store-login', {
            err: errors.array()
        })
    }
}
]

module.exports.checkStore = (req, res) => {
    try {
        if(req.user.name && req.cookies.token) {
            res.redirect('/store/store-ui')
        } else {
            res.render('store-login')
        }
    } catch {
        res.render('store-login')
    }
}