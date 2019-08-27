/* require('../controller-passport') */
let client = require('../../pg')

module.exports.seeCard = (req, res) => {
    if(req.user.id) {
        let sql = "SELECT product.id, name, img, COUNT(name) AS quantity, SUM(price) AS totalprice "
        sql += "FROM product INNER JOIN currentorder ON product.id = currentorder.product_id "
        sql += "WHERE custome_id = " + req.user.id
        sql += " GROUP BY product.id, name, img"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 12 controllers.member.card.js')
            } else {
                res.render('card', {
                    added: result.rows
                })
            }
        })
    } else {
        res.redirect('login')
    }
}

module.exports.addToCard = (req, res) => {
    let id = req.params.id
    if(isNaN(id)) {
        res.writeHead(404, {
            "Content-type" : "text/html"
        })
        res.end('<h1>Invalid Product</h1><a href = "/"> Back </a>')
        return
    }
    if(req.user.id) {
        let sql = "INSERT into currentorder(custome_id, product_id) VALUES "
        sql += "("+req.user.id+","+id+")"
        client.query(sql, (err, result) => {
            if (err) {
                console.log('err in line 39 controllers.member.card.js')
            }
            res.redirect('/')
        })
    } else {
        res.redirect('/login')
    }
}

module.exports.deleteProductInCard = (req, res) => {
    let id = req.params.id
    if(isNaN(id)) {
        res.writeHead(404, {
            "Content-type" : "text/html"
        })
        res.end('<h1>Invalid Product</h1><a href = "/"> Back </a>')
        return
    }
    if(req.user.id) {
        let sql = "DELETE FROM currentorder WHERE product_id = " + id
        sql += " AND custome_id = " + req.user.id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('Err in line 63 controllers.member.card.js')
            } else {
                res.redirect('/card')
            }
        })
    } else {
        res.redirect('/')
    }
}

module.exports.makeOrderFromCard = (req, res) => {
    if(req.user.id) {
        let check = "SELECT * FROM currentorder WHERE custome_id = " + req.user.id
        client.query(check, (err, result) => {
            if(err) {
                console.log('err in line 79 at controllers.member.card.js')
            }
            if(result.rows.length == 0) {
                res.redirect('/')
            } else {
            
                //CREATE AN ORDER FOR CUSTOMER
                let sql = "INSERT INTO customer_order(customer_id) VALUES ("+req.user.id+")" 
                client.query(sql, (err, result) => {
                    if(err) {
                        console.log('err in line 89 controllers.member.card.js')
                    }
                })
                //GET ID OF CUSTOMER'S ORDER ABOVE
                sql = "SELECT id FROM customer_order WHERE customer_id = " + req.user.id
                sql += " AND is_order_detail = FALSE"
                client.query(sql, (err, result) => {
                    if(err) {
                        console.log('Err in line 97 controllers.member.card.js')
                    } else {
                        let id = result.rows[0].id
                        //GET ID OF PRODUCT THAT CUSTOMER ORDER AND QUANTITY OF THAT PRODUCT FROM CURRENT ORDER TABLE
                        sql = "SELECT product.id, COUNT(name) FROM product"
                        sql += " INNER JOIN currentorder ON currentorder.product_id = product.id"
                        sql += " WHERE custome_id = " + req.user.id
                        sql += " GROUP BY product.id"
                        client.query(sql, (err, result) => {
                            if(err) {
                                console.log('err in line 111 card.js')
                            } else {
                                for(var i = 0; i < result.rows.length; i++) {
                                    //CREATE ORDER DETAIL FOR CUSTOMER'S ORDER ABOVE
                                    let insert = "INSERT INTO order_detai(order_id, product_id, quantity) VALUES "
                                    insert += "("+id+", "+result.rows[i].id+", "+result.rows[i].count+")"
                                    client.query(insert, (err, result) =>{
                                        if(err) {
                                            console.log('err in line 115 controllers.member.card.js')
                                        }
                                    })
                                }
                                //DELETE CUSTOMER PRODUCT'S ORDER IN CURRENT ORDER TABLE AND SET ORDER OF CUSTOMER BELOW IS TRUE
                                //THAT MEAN ORDER DETAIL HAVE CREATED FOR THAT ORDER ABOVE
                                sql = "DELETE FROM currentorder WHERE custome_id = " + req.user.id
                                sql += "; UPDATE customer_order SET is_order_detail = TRUE WHERE customer_id = " + req.user.id
                                client.query(sql, (err, result) => {
                                    if(err) {
                                        console.log('err in line 126 controllers.member.card.js')
                                    } else {
                                        res.redirect('/')
                                    }
                                }) 
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.redirect('/login')
    }
}