const client = require('../../pg')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const extractJwt = (req) => {
    let token = null
    if (req && req.cookies.token) {
        token = req.cookies.token
    }
    return token
} 

let opts = {}
opts.jwtFromRequest = extractJwt
opts.secretOrKey = 'helloadmin'

passport.serializeUser((user, done) => {
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    let sql = 'SELECT * FROM atnadmin WHERE id = ' + id
    client.query(sql, (err, result) => {
        if (err) {
            return done(err, false)
        }
        if (result.rows.length == 1) {
            return done(null, result.rows[0])
        }
    })
})

passport.use('jwt-admin', new JwtStrategy(opts, (jwt_payload, done) => {
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