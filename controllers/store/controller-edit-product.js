let sess
let client = require('../../pg')
let fs = require('fs')
let multer = require('multer')
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
    },
    filename: (req, file, cb) => {
        cb(null, req.user.name + file.originalname)
    }
})
let limits = {fileSize: 1024 * 1024}
let fileFiter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png'
    ) {
        cb(null, true)
    } else {
        cb('Wrong format of image')
    }
}
let uploads = multer({limits: limits, fileFilter: fileFiter, storage: storage}).single('file')

module.exports.showFormEdit = (req, res) => {
    let id = req.params.id
    let errors = []
    
    if (isNaN(id)) {
        errors.push('Invalid Product')
        res.writeHead(404, {
            "Content-type" : "text/html"
        })
        res.end('<h1>'+errors[0]+'</h1>' + '<a href="/store/product">Back</a>')
    } else {
        let sql = "SELECT * FROM product WHERE id = " + id
        sql += " AND store_id = " + req.user.id
        client.query(sql, (err, result) => {
            if (err) {
                console.log(err)
            } else if (result.rows.length == 0) {
                res.writeHead(404, {
                    "Content-type" : "text/html"
                })
                res.end('<h1>Invalid Product</h1>' + '<a href="/store/product">Back</a>')
            } else {
                res.render('edit-product', {
                    input: result.rows[0]
                })
            }
        })
    }
}

module.exports.processEdit = (req, res) => {
    uploads(req, res, err => {
        const q = req.body
        const name = q.name
        const price = q.price
        const info = q.info
        const id = req.params.id
        let errors = []
        if (name == '') {
            errors.push('Please Input Product Name')
        }
        if (isNaN(price) || price =='') {
            errors.push('Price must be number')
        }
        if (info == '') {
            errors.push('Please input information')
        }
        if(errors.length > 0) {
            res.render('edit-product', {
                error: errors
            })
            return
        }
        let sql = "SELECT img FROM product WHERE id = " + id
        sql += " AND store_id = " + req.user.id
        client.query(sql, (err, result) => {
            if (result.rows.length == 0) {
                res.writeHead(404, {
                    "Content-type" : "text/html"
                })
                res.end('<h1>Invalid Product</h1>' + '<a href="/store/product">Back</a>')
            } else if (req.file) {
                fs.unlink('./public' + result.rows[0].img, err => {
                    if(err) {
                        console.log(err)
                    }
                })
            }
        })
        if (err) {
            if(err.message == undefined) {
                res.render('edit-product', {
                    result: err
                })
            } else {
                res.render('edit-product', {
                    result: err.message
                })
            }
        } else if (req.file) {
            let img = "/img/" + req.user.name + req.file.originalname
            sql = "UPDATE product SET"
            sql += " name = '" + name + "'"
            sql += ", price = " + price
            sql += ", info = '" + info + "'"
            sql += ", img = '" + img + "'"
            sql += ", description = 'WATING ADMIN CONFIRM'"
            sql += ", is_show = FALSE"
            sql += " WHERE id = " + id 
            sql += " AND store_id = " + req.user.id
            client.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                } else {
                    res.render('edit-product', {
                        result: 'Update Successfully. Please Waiting For Admin Confirm'
                    })
                }
            })
        } else {
            let sql = "UPDATE product SET"
            sql += " name = '" + name + "'"
            sql += ", price = " + price
            sql += ", info = '" + info + "'"
            sql += ", description = 'WATING ADMIN CONFIRM'"
            sql += ", is_show = FALSE"
            sql += " WHERE id = " + id 
            sql += " AND store_id = " + req.user.id
            client.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                } else {
                    res.render('edit-product', {
                        result: 'Update Successfully. Please Waiting For Admin Confirm'
                    })
                }
            })
        }
    })
}