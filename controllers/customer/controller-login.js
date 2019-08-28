const client = require('../../pg')
const jwt = require('jsonwebtoken')
let {check, validationResult} = require('express-validator')

module.exports.checkMemberLogin = (req, res) => {
    try {
        if (req.user.cname && req.cookies.token) {
            res.redirect('/card')
        } else {
            res.render('login')
        }
    } catch {
        res.render('login')
    }
}

module.exports.loginProcess = [
    check('username').not().isEmpty().withMessage('Please Enter Your UserName')
        .isLength({max: 25}).withMessage('Length Of Username Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Enter Your Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Character').escape(),
    (req, res) => {
    sess = req.session
    let q = req.body
    let username = q.username
    let password = q.password
    let checkbox = q.checkbox
    let errors = validationResult(req)
    if (checkbox == 'on') {
        res.cookie('username', username, {domain: 'localhost', path: '/login'})
        res.cookie('password', password, {domain: 'localhost', path: '/login'})
    } else {
        res.clearCookie('password', {path: '/login'})
        res.clearCookie('username', {path: '/login'})
    }
    if(errors.isEmpty()) {
        sql = "SELECT * FROM customer WHERE username = '"+username+"'"
        client.query(sql, function(err, result) {
            if(password == result.rows[0].password) {
                let token = jwt.sign({id: result.rows[0].id}, 'customer')
                res.cookie('token', token)
                res.redirect('/card')
            } else {
                res.render('login', {
                    result: 'wrong Username Or Password'
                })
            }
        })
    } else {
        res.render('login', {
            err: errors.array()
        })
    }
}
]

module.exports.facebook = (req, res) => {
    let token = jwt.sign({id: req.user.id}, 'customer')
    res.cookie('token', token, {domain: 'atn-final.herokuapp.com'})
    res.redirect('/')
}
