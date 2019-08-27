let client = require('../../pg')
let sess

module.exports.seeListOrder = (req, res) => {
    if(req.user.id) {
        let sql = "SELECT * FROM customer_order WHERE customer_id = " + req.user.id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 10 at controllers.member.myorder.js')
            } else {
                res.render('myorder', {
                    myorder: result.rows
                })
            }
        })
    } else {
        res.redirect('/login')
    }  
}

module.exports.seeDetailOrder = (req, res) => {
    let id = req.params.id
    if(req.user.id) {
        let sql = "SELECT id FROM customer_order WHERE customer_id = " + req.user.id
        sql += " AND id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 30 at controllers.member.myorder.js')
            } else if (result.rows.length == 1){
                sql = "SELECT name, img, quantity, (price * quantity) AS total"
                sql += " FROM product, order_detai"
                sql += " WHERE product.id = order_detai.product_id"
                sql += " AND order_detai.order_id = " + id
                client.query(sql, (err, result) => {
                    if (err) {
                        console.log('err in line 40 myorder.js')
                    } else {
                        res.render('myorder', {
                            detail: result.rows
                        })
                    }
                })               
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/login')
    }  
}