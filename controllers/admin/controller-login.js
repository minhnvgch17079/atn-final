const client = require('../../pg')
let {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
module.exports.loginAdmin = [
    check('username').not().isEmpty().withMessage('Please Enter Your User Name')
         .isLength({max: 25}).withMessage('Length Of Ueser Name Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Input Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits by 25 character').escape(),
    (req, res) =>{
    let q = req.body
    let username = q.username
    let password = q.password
    let errors = validationResult(req)
    if(errors.isEmpty()) {
        let sql = "select * from atnadmin where username = '"+username+"'"
        client.query(sql, (err, result) => {
            if(password == result.rows[0].password) {
                let token = jwt.sign({id: result.rows[0].id}, 'admin')
                res.cookie('token', token, {domain: 'localhost'})
                res.redirect('/admin/1')
            } else {
                res.render('admin', {
                    result: 'Wrong username and password'
                })
            }
        })
    } else {
        res.render('admin', {
            err: errors.array()
        })
    }
}
]

module.exports.checkAdminLogin = (req, res) => {
    try {
        if (req.user.amin && req.cookies.token) {
            res.redirect('/admin/1')
        } else {
            res.render('admin')
        }
    } catch {
        res.render('admin')
    }
}