const express = require('express')
const router = express.Router()
const client = require('../../pg')
const multer = require('multer')
const passport = require('passport')
const fs = require('fs')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
    },
    filename: (req, file, cb) => {
        cb(null, req.user.name + file.originalname)
    }
})

let fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png'
    ) {
        cb(null, true)
    } else {
        cb('Wrong Format Of Image, Only Image Accepted')
    }
}

let limits = {fileSize: 1024 * 1024}
let uploads = multer({limits: limits, fileFilter: fileFilter ,storage: storage}).single('file')

router.get('/', (req, res) => {
    let page = parseInt(req.query.page) - 1
    let sql
    if(isNaN(page)) {
        sql = "SELECT * FROM PRODUCT WHERE is_show = TRUE ORDER BY id FETCH FIRST 16 ROWS ONLY"
    } else {
        sql = "SELECT * FROM PRODUCT WHERE is_show = TRUE ORDER BY id"
        sql += " OFFSET " + (page * 16) + " ROWS"
        sql += " FETCH FIRST 16 ROWS ONLY"
    }
    client.query(sql, (err, result) => {
        if (err) { console.log('Err in line 9 products-api') }
        else if (result.rows.length > 0) {
            res.status(200).json({
                data: result.rows
            })
        } else {
            res.status(200).json({
                data: 'Not Product Found'
            })
        }
    })
})

router.get('/:productId', (req, res) => {
    let productId = req.params.productId
    if(isNaN(productId)) {
        res.status(404).json({
            error: 'Specify product must find by id'
        })
    } else {
        let sql = "SELECT * FROM product WHERE id = " + productId
        client.query(sql, (err, result) => {
            if (err) {console.log('Err in line 39 products api')}
            else if (result.rows.length == 1) {
                res.status(200).json({
                    data: result.rows
                })
            } else {
                res.status(200).json({
                    error: 'No Found Product'
                })
            }
        })
    }
})

router.post('/', passport.authenticate('jwt-store'), (req, res) => {
    uploads(req, res, err => {
        let name = req.body.name
        let price = req.body.price
        let info = req.body.info
        var errors = []
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
            res.status(500).json({
                errors
            })
            return
        }
        if(err) {
            if(err.message == undefined) {
                res.status(500).json({
                    err //cb('Wrong Format Of Image, Only Image Accepted')
                })
                return
            } else {
                res.status(500).json({
                    err: err.message //File too large
                })
            }
            return
        }
        if(req.file) {
            let img = '/img/' + req.user.name + req.file.originalname
            let sql = "insert into product(name, price, info, store_id, img) values "
            sql += "('"+name+"', '"+price+"', '"+info+"', '"+req.user.id+"', '"+img+"')" 
            client.query(sql, (err, result) => {
                if (err) {
                    console.log('err in line 118 products api')
                } else {
                    res.status(200).json({
                        result: 'Adding Successfully! Please Waiting For Admin Confirm',
                        newProductAdded: {
                            name,
                            price,
                            info,
                            img
                        }
                    })
                }
            })           
        } else {
            res.status(500).json({
                error: 'Need Image For Product'
            })
        }
    })
})

router.delete('/:productId', passport.authenticate('jwt-store'), (req, res) => {
    let errors = []
    let productDeleted
    const productId = req.params.productId
    if(isNaN(productId)) {
        errors.push('Invalid Product')
        res.status(500).json({
            error: 'Invalid Product'
        })
        return
    }
    if(errors.length == 0) {
        let sql = " FROM product WHERE id = " + productId + " AND store_id = " + req.user.id
        client.query("SELECT *" + sql, (err, result) => {
            if(err || result.rows.length == 0) {
                res.status(404).json({
                    error: 'Can Not Delete Invalid Product Or Products Not Own You'
                })
            } else {
                productDeleted = result.rows
                fs.unlink('./public' + result.rows[0].img, err => {
                    if(err) {
                        console.log(err + 'in line 160 products api')
                    }
                })
                client.query("DELETE" + sql, (err, result) => {
                    if (err) {
                        console.log(err + 'in line 165 products api')
                    } else {
                        res.status(200).json({
                            result: 'Delete Product Successfully',
                            productDeleted
                        })
                    }
                })
            }
        })
    }
})

router.patch('/:productId', passport.authenticate('jwt-store'), (req, res) => {
    uploads(req, res, err => {
        const q = req.body
        const name = q.name
        const price = q.price
        const info = q.info
        const productId = req.params.productId
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
            res.status(500).json({
                errors
            })
            return
        }
        let sql = "SELECT img FROM product WHERE id = " + productId
        sql += " AND store_id = " + req.user.id
        client.query(sql, (err, result) => {
            if (result.rows.length == 0) {
                res.status(404).json({
                    error: 'Invalid Product Or You Can Not Edit Product Not Own You'
                })
            } else if (req.file) {
                fs.unlink('./public' + result.rows[0].img, err => {
                    if(err) {
                        console.log(err + 'line 213 in producs api')
                    }
                })
            }
        })
        if (err) {
            if(err.message == undefined) {
                res.status(500).json({
                    error: err
                })
            } else {
                res.status(500).json({
                    error: err.message
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
            sql += " WHERE id = " + productId 
            sql += " AND store_id = " + req.user.id
            client.query(sql, (err, result) => {
                if(err) {
                    console.log(err + 'inline 241 products api')
                } else {
                    res.status(200).json({
                        result: 'Update Successfully. Please Waiting For Admin Confirm',
                        newUpdate: {
                            name,
                            price,
                            info,
                            img
                        }
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
            sql += " WHERE id = " + productId 
            sql += " AND store_id = " + req.user.id
            client.query(sql, (err, result) => {
                if(err) {
                    console.log(err + 'inl ine 259 products api')
                } else {
                    res.status(200).json({
                        result: 'Update Successfully. Please Waiting For Admin Confirm',
                        newUpdate: {
                            name,
                            price,
                            info
                        }
                    })
                }
            })
        }
    })
})

module.exports = router