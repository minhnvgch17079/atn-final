let client = require('../../pg')

module.exports.adminUI = (req, res) => {
    let id = req.params.id
    if(req.user.username && id == 1) { // SHOW STATISTIC
        res.render('admin-ui', {
            statistics: 'ok'
        })
    } else if (req.user.username && id == 2) { // SHOW MANAGEMENT STORE ACCOUNT INTERFACE
        let sql = "SELECT * FROM store"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 45 controller.admin.js')
            } else {
                res.render('admin-ui', {
                   account: result.rows 
                })
            }
        })
    } else if (req.user.username && id == 3) { // SHOW CONFIRM PRODUCT
        let sql = "SELECT * FROM product WHERE is_show = FALSE"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 57 controller.admin.js')
            } else {
                res.render('admin-ui', {
                   product: result.rows 
                })
            }
        })
    } else if (req.user.username && id == 4) { // SHOW CUSTOMER ORDER
        let sql = "SELECT * FROM customer_order WHERE status != 'DONE'"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 68 at controllers.admin.js')
            } else {
                res.render('myorder', {
                    adminmyorder: result.rows
                })
            }
        })
    } 
}

module.exports.statistics = (req, res) => {
    let id = req.params.id
    if(req.user.username && id == 1) {
        let sql = "WITH cte_a AS ("
        sql += " SELECT product.id, product.store_id, COUNT(product.id) * product.price AS price FROM order_detai, product"
        sql += " WHERE order_detai.product_id = product.id AND"
        sql += " order_id IN ("
        sql += " SELECT id FROM customer_order"
        sql += " WHERE order_date >= '"+req.body.from+"'"    
        sql += " AND order_date <= '"+req.body.to+"'"  
        sql += " ) GROUP BY product.id )"
        sql += " SELECT name, SUM(price) FROM store"
        sql += " INNER JOIN cte_a ON store.id = cte_a.store_id GROUP BY name"
        client.query(sql, (err, result) => {
            if(err) {
                res.redirect('/admin/1')
            } else {
                res.render('admin-ui', {
                    results: result.rows
                })
            }
        })
    }
}









