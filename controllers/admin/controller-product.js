const client = require('../../pg')
let url = require('url')

module.exports.confirmProduct = (req, res) => {
    let baseURI = url.parse(req.url, true)
    let id = parseInt(baseURI.query.id)
    let show = baseURI.query.show
    if(!req.user.username) {
        res.redirect('/admin')
    } else if (isNaN(id)) {
        res.redirect('/admin/3')
    } else if (show == 'TRUE') {
        let sql = "UPDATE product SET description = 'ACCEPTED BY ADMIN', is_show = " + show + " WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                res.redirect('/admin/3')
            } else {
                res.redirect('/admin/3')
            }
        })
    } else if (show == 'FALSE') {
        res.render('admin-ui', {
            refuse: id
        })
    } else {
        res.redirect('/admin/3')
    }
}

module.exports.refuse = (req, res) => { // NEED INPUT VALIDATION 
    if(req.user.username) {
        let reason = req.body.reason
        let id = req.body.id
        let sql = "UPDATE product SET description = '"+reason+"' WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 138 controller.admin.js')
            } else {
                res.redirect('/admin/3')
            }
        })
    } else {
        res.redirect('/admin')
    }
}