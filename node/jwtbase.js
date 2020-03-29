const jwt = require('jsonwebtoken')
const jwtKey = '502asdFZ!'
const jwtExpirySeconds = 300

const refresh = (req,res) => {
    const token = req.cookies.token
    
    if(!token){
        return res.status(401).end()
    }
    var payload
    try{
        payload = jwt.verify(token,jwtKey)
    } catch(e){
        if(e instanceof jwt.JsonWebTokenError){
            return res.status(401).end()
        }
        return res.status(400).end()
    }

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if(payload.exp - nowUnixSeconds > 30){
        return res.status(400).end()
    }

    const newToken = jwt.sign({username:payload.username},jwtKey,{
        algorithm:'HS256',
        expiresIn:jwtExpirySeconds
    })

    res.cookie('token',newToken,{maxAge:jwtExpirySeconds * 1000})
    res.end()
}

module.exports = {
    jwt,
    jwtKey,
    jwtExpirySeconds,
    refresh
}