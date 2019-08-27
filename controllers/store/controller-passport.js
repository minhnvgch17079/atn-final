const passport = require('passport')
const passport_jwt = require('passport-jwt')
const JwtStrategy = passport_jwt.Strategy
const extractorJwt = (req) => {
    let token = null
    if(req && req.cookies) {
        token = req.cookies.token
    }
    return token
}
const client = require('../../pg')

let opts = {}
opts.jwtFromRequest = extractorJwt
opts.secretOrKey = 'Hellostore'

passport.serializeUser((user, done) => {
    return done(null, user.id)
})
passport.deserializeUser((id, done) => {
    let sql = "SELECT * FROM store WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log(err + '')
            } else {
                return done(null, result.rows[0])
            }
    })
})

passport.use('jwt-store', new JwtStrategy(opts, (jwt_payload, done) => {
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