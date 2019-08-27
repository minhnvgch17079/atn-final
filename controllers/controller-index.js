let client = require('../pg')
let {check, validationResult} = require('express-validator')

module.exports.showProductAsPage = (req, res) => {
    let page = req.query.page - 1 // 0 mean OFFSET 0 ROWS FIRST, 1->16, 2->32
    let sql = "SELECT * FROM product WHERE is_show = TRUE ORDER BY id"
    sql += " OFFSET " + page * 16 + " ROWS" //NUMBER OF ROWS THAT OFFSET
    sql += " FETCH FIRST 16 ROWS ONLY" //NUMBER OF PRODUCT WANT IN A PAGE
    client.query(sql, (err, result) => {
        if(err) {
            res.redirect('/?page=1')
        } else {
            try {
                if(req.user.cname) {
                    res.render('index', {
                        username: req.user.username,
                        product: result.rows,
                        notstore: 'ok'
                    })
                } else if(req.user.name) {
                    res.render('index', {
                        storename: req.user.username,
                        product: result.rows,
                        notstore: 'ok'
                    })
                } else {
                    res.render('index', {
                        amin: req.user.amin,
                        product: result.rows,
                        notstore: 'ok'
                    })
                }
            } catch {
                res.render('index', {
                    product: result.rows,
                    notstore: 'ok'
                })
            }
        }
    })
}

module.exports.searchProduct = [
    check('search').escape(),
    (req, res) => {
        let search = req.body.search
        let sql = "SELECT * FROM product WHERE is_show = TRUE AND LOWER(name) LIKE '%"+search.toLowerCase()+"%'"
        client.query(sql, (err, result) => {
            if(err) {
                res.redirect('/?page=1')
            } else {
                try {
                    if(req.user.username && req.user.cname) {
                        res.render('index', {
                            username: req.user.username,
                            product: result.rows,
                            notstore: 'ok'
                        })
                    } else if(req.user.username) {
                        res.render('index', {
                            storename: req.user.username,
                            product: result.rows,
                            notstore: 'ok'
                        })
                    }
                } catch {
                    res.render('index', {
                        product: result.rows,
                        notstore: 'ok'
                    }) 
                }
            }
        })
    }
]

module.exports.seeStore = [
    check('storeid').isLength({max: 3}).escape(),
    (req, res) => {
        let storeid = req.params.id
        let page = req.query.page - 1
        let errors = validationResult(req)
        if(errors.isEmpty()) {
            let sql = "SELECT * FROM product WHERE is_show = TRUE AND store_id = " + storeid
            sql += " OFFSET " + (page * 16) + " ROWS"
            sql += " FETCH FIRST 16 ROW ONLY"
            client.query(sql, (err, result) => {
                if (err) {
                    if(isNaN(storeid)) {
                        res.redirect('/')
                    } else res.redirect('/' + storeid +'?page=1')
                } else {
                    sql = "SELECT * FROM store WHERE id = " + storeid
                    client.query(sql, (err, result1) => {
                        if(err) {
                            console.log('err in line 116 at index.js')
                        } else {
                            try {
                                if(req.user.username && req.user.cname) {
                                    res.render('index', {
                                        username: req.user.username,
                                        product: result.rows,
                                        store: result1.rows[0]
                                    })
                                } else if(req.user.username) {
                                    res.render('index', {
                                        storename: req.user.username,
                                        product: result.rows,
                                        store: result1.rows[0]
                                    })
                                }
                            } catch {
                                res.render('index', {
                                    product: result.rows,
                                    store: result1.rows[0]
                                }) 
                            }
                        }
                    })
                }
            })
        } else {
            res.redirect('/')
        }
    }
] 

