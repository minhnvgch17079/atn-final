let client = require('../../pg')
let {check, validationResult} = require('express-validator')

module.exports.processRegister = [
    check('username').not().isEmpty().withMessage('Please Input UserName')
        .isLength({max: 25}).withMessage('Length Of UserName Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Input Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Characters').escape(),
    (req, res) => {
    let q = req.body
    let username = q.username
    let password = q.password
    let confirm = q.confirm
    let info = q.info
    let errors = validationResult(req)
    if(password !== confirm) {
        res.render('register', {
            result: 'Confirm Password Not Match',
            input: q
        })
    } else if(errors.isEmpty()) {
        let sql = "select * from customer where username='" + username + "'"
        client.query(sql, function(err, r) {
            if(err) {
                console.log('Err in line 27 controller-register.js')
            } else if (r.rows.length == 1) {
                res.render('register', {
                    result: 'Register faild! UserName Have Exist',
                    input: q
                })
            } else {
                    try {
                        sql = "insert into customer(username, password, info) values "
                        sql += "('"+username+"', '"+password+"', '"+info+"')"
                        client.query(sql, (err, r) => {
                            try {
                                res.render('register', {
                                    result: 'Register Successfully',
                                    input: q
                                })
                            } catch {
                                console.log('err in line 40 controller.member.register')
                            }
                        })
                    } catch {
                        console.log('err in line 49 controller.member.register')
                    }
            }
        })
    } else {
        res.render('register', {
            err: errors.array(),
            input: q
        })
    }
}
]