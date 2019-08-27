//MANAGE PRODUCT INTERFACE FOR STORE

const client = require('../../pg')

module.exports.showProduct = (req, res) => {
    sess = req.session
    let sql = "SELECT * FROM product WHERE store_id = " + req.user.id
    client.query(sql, (err, result) => {
        if(err) {
            console.log('err in line 20 controller.store.product.js')
        } else {
            res.render('list-product', {
                data: result.rows
            })
        }
    })
}