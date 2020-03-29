const { Webuser } = require('./../mongooseapi')

const { jwt,jwtKey,jwtExpirySeconds } = require('./../jwtbase')

const webusermanager = {

    add : (req,res) => {
        
        var webuser = new Webuser({
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
        });

        Webuser.find({
            $or:[{
                email:req.body.email
            },
            {
                username:req.body.username 
            }]
        }, (err,document) => {
            if(document.length){
                console.log(document)
                res.status(422).json({
                    "message":"Boyle bir kullanici adi veya email adresi sistemde mevcut"
                })
            } 
            else {
                webuser.save(function(err){
                    if(err){
                        console.log(err)
                        res.status(500).json({
                            data:err
                        })
                    }
                    else{

                        const token = jwt.sign({email:webuser.email,username:webuser.username,id:webuser._id},
                            jwtKey,{
                                algorithm:'HS256',
                                expiresIn:jwtExpirySeconds
                            })
                            
                            var tokenmodel = new Object()
                            tokenmodel.token = token
                            tokenmodel.id = webuser._id
                            tokenmodel.email = webuser.email
                            tokenmodel.username = webuser.username

                        res.status(200).json(tokenmodel)
                    }
                    
                })
            }
        })

    },
    token:(req,res) => {
        Webuser.find({email:req.body.email,password:req.body.password},(err,document) => {
            if(!err){
                if(document.length){
                    var email = req.body.email
                    const token = jwt.sign({email},jwtKey,{
                        algorithm:'HS256',
                        expiresIn:jwtExpirySeconds
                    })
                    var tokenmodel = new Object()
                    tokenmodel.token = token
                    tokenmodel.id = document[0]._id
                    tokenmodel.email = document[0].email
                    tokenmodel.username = document[0].username

                    res.status(200).json(tokenmodel)
                }
                else{
                    res.status(401).send('Email adresi veya şifre hatalı')
                }
            }
            else{
                res.status(500).json(err)
            }
        })
    }

}

module.exports = {
    webusermanager
}