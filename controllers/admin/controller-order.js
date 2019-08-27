const client = require('../../pg')
module.exports.processCustomerOrder = (req, res) => {
    let id = parseInt(req.query.id)
    let status = req.query.status
    if (isNaN(id)) {
        res.redirect('/admin/4')
    } else if (
        status == 'CONFIRM' ||
        status == 'GOING TO GET THE PRODUCT' ||
        status == 'ORDER IS BEING DELIVERED' ||
        status == 'DONE'
    ) {
        let sql = "UPDATE customer_order SET status = '"+status+"' WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 16 controller-order')
            } else {
                res.redirect('/admin/4')
            }
        })

    } else {
        res.redirect('/admin/4')
    }
}

module.exports.seeDetailOrder = (req, res) => {
    let id = req.params.id
    if(req.user.username) {
        let sql = "SELECT id FROM customer_order" 
        sql += " WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 167 at controllers.admin.js')
            } else if (result.rows.length == 1){
                sql = "SELECT name, img, quantity, (price * quantity) AS total"
                sql += " FROM product, order_detai"
                sql += " WHERE product.id = order_detai.product_id"
                sql += " AND order_detai.order_id = " + id
                client.query(sql, (err, result) => {
                    if (err) {
                        console.log('err in line 185 in controller.admin.js')
                    } else {
                        res.render('myorder', {
                            admindetail: result.rows
                        })
                    }
                })               
            } else {
                res.redirect('/admin')
            }
        })
    } else {
        res.redirect('/admin')
    }  
}