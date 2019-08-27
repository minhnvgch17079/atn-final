const passport = require('passport')
const client = require('../pg')
const JwtStrategy = require('passport-jwt').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const extractorJwt = (req) => {
    let token = null
    if (req && req.cookies.token) {
        token = req.cookies.token
    }
    return token
}

let customer = {}
customer.jwtFromRequest = extractorJwt
customer.secretOrKey = 'customer'

let store = {}
store.jwtFromRequest = extractorJwt
store.secretOrKey = 'store'

let admin = {}
admin.jwtFromRequest = extractorJwt
admin.secretOrKey = 'admin'

passport.serializeUser((user, done) => {
    if(user.amin) {
        return done(null, user.amin)
    } else if (user.name) {
        return done(null, user.name)
    } else {
        return done(null, user.id)
    }
})

passport.deserializeUser((id, done) => {
    let sql
    if (!isNaN(id)) {
        sql = "SELECT * FROM customer WHERE id = " + id
        client.query(sql, (err, result) => {
            if (err) {
                return done(err, false)
            }
            if (result.rows.length == 1) {
                return done(null, result.rows[0])
            }
        })
    } else if (id == 'admin') {
        sql = "SELECT * FROM atnadmin WHERE amin = '"+id+"'"
        client.query(sql, (err, result) => {
            if (err) {
                return done(err, false)
            }
            if (result.rows.length == 1) {
                return done(null, result.rows[0])
            }
        })
    } else {
        sql = "SELECT * FROM store WHERE name = '"+id+"'"
        client.query(sql, (err, result) => {
            if (err) {
                return done(err, false)
            }
            if (result.rows.length == 1) {
                return done(null, result.rows[0])
            }
        })
    }
})

passport.use('jwt-customer', new JwtStrategy(customer, (jwt_payload, done) => {
    let sql = "SELECT * FROM customer WHERE id = " + jwt_payload.id
    client.query(sql, (err, result) => {
        if (err) {
            return done(err, false)
        }
        if (result.rows.length == 1) {
            return done(null, result.rows[0])
        } else {
            return done(null, false)
        }
    })
}))

passport.use('jwt-store', new JwtStrategy(store, (jwt_payload, done) => {
    let sql = "SELECT * FROM store WHERE id = " +jwt_payload.id
    store = 1
    client.query(sql, (err, result) => {
        if (err) {
            return done(err, false)
        }
        if (result.rows.length == 1) {
            return done(null, result.rows[0])
        } else {
            return done(null, false)
        }
    })
}))

passport.use('jwt-admin', new JwtStrategy(admin, (jwt_payload, done) => {
    let sql = 'SELECT * FROM atnadmin WHERE id = ' + jwt_payload.id
    client.query(sql, (err, result) => {
        if (err) {
            return done(err, false)
        } 
        if (result.rows.length == 1) {
            return done(null, result.rows[0])
        } else {
            return done(null, false)
        }
        
    })
})
)

passport.use(new FacebookStrategy({
    clientID: '2116149092027626',
    clientSecret: '76386da06a2ff3882bd76af5e211494c',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, cb) => {
    let sql = "SELECT * FROM customer WHERE username = '"+profile.id+"'" 
    client.query(sql, (err, result) => {
        if(err) {
            return cb(err, false)
        } 
        if(result.rows.length == 1) {
            return cb(null, result.rows[0])
        } else {
            sql = "INSERT INTO customer (username, password, info) VALUES"
            sql += "('"+profile.id+"','"+profile.id+"', 'Facebook')"
            client.query(sql, (err, result) => {
                if(err) {
                    console.log('err inline 132 controller-passport.js')
                } else {
                    sql = "SELECT * FROM customer WHERE username = '"+profile.id+"'"
                    client.query(sql, (err, result1) => {
                        if(err) {
                            console.log('err inline 137 controller-passport')
                        } else {
                            return cb(null, result1.rows[0])
                        }
                    })
                }
            })
        }
    })
}))