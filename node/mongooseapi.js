const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://admin:lahmacun@testmongo-jbmyn.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser:true
})

var webuserSchema = new mongoose.Schema({
    email:String,
    username:String,
    password:String,
    isactive:{type:Boolean,default:true},
    isdelete:{type:Boolean,default:false},
    adddate:{type:Date,default:Date.now},
    lastlogindate:Date
})

var adminuserSchema = new mongoose.Schema({
    email:String,
    username:String,
    password:String,
    isactive:Boolean,
    isdelete:Boolean,
    adddate:{type:Date,default:Date.now},
    lastlogindate:Date
})

var Webuser = mongoose.model('Webuser',webuserSchema)
var Adminuser = mongoose.model('Adminuser',adminuserSchema)

module.exports = {
    Webuser,
    Adminuser
}