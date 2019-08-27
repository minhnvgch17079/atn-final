const multer = require('multer')
let client = require('../../pg')
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
let uploads = multer({limits: limits, fileFilter: fileFilter, storage: storage}).single('file')

module.exports.showFormAddProduct = (req, res) => {
    res.render('add-product')
}

module.exports.processAddProduct = (req, res) => {
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
            res.render('add-product', {
                error: errors
            })
            return
        }
        if(err) {
            if(err.message == undefined) {
                res.render('add-product', {
                    result: err
                })
            } else {
                res.render('add-product', {
                    result: err.message
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
                    console.log('err in line 78 controller.store.add.js')
                } else {
                    res.render('add-product', {
                        result: 'Adding Successfully! Please Waiting For Admin Confirm'
                    })
                }
            })           
        } else {
            res.render('add-product', {
                result: 'Need Image For Product'
            })
        }
    })
    
}