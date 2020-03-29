const express = require('express')
const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var bodyParser = require('body-parser')
var is = require('is_js')
const path = require('path')
const {check,validationResult,body} = require('express-validator')
var _ = require('lodash')

const {jwt,jwtExpirySeconds,jwtKey} = require('./jwtbase')

const {
    webusermanager
} = require('./manager/webusermanager')

app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next();
})

http.listen(3000, function(){
    console.log('Start ! listening on *:3000')
})

app.get('/',function(req,res){
    res.send('<h1 style="text-align: center;margin: 20% auto;">Welcome to my api</h1>')
})

app.post('/api/webuseradd',[
    body('email').not().isEmpty().isEmail(),
    body('username').not().isEmpty(),
    body('password').not().isEmpty()
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors:errors.array()
        })
    }
    else{
        console.log(req.body)
        webusermanager.add(req,res)
    }
})

app.post('/api/token',[
    body('email').not().isEmpty().isEmail(),
    body('password').not().isEmpty()
],(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors:errors.array()
        })
    }
    else{
        webusermanager.token(req,res)
    }
})

app.post('/api/tokencontrol',(req,res) => {
    var token = req.headers.authorization.split(" ")[1]
    var payload
    try {
        payload = jwt.verify(token,jwtKey)
        
        res.status(200).send(true)
    } catch(e){
        if(e instanceof jwt.JsonWebTokenError){
            return res.status(401).end()
        }
        return res.status(400).end()
    }
})
