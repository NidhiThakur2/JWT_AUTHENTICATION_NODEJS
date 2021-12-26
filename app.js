const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser=require('body-parser')

const app = express();
const user={
    username:'admin',
    password:'password'
}
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var refreshToken;
app.use(express.json())
app.use(express.Router())
app.get('/api',(req,res)=>{
    res.json({
        message:'Welcome to the API'
    })
})
app.post('/about',verifyToken,(req,res)=>{
    jwt.verify(req.token,'structo',(err,authData)=>{
        if(err){
            res.sendStatus(401)
        }else
            res.json({
                message: 'Hello World'

            })
            
    })
})
app.post('/token',(req,res)=>{
     const expiry={
          expiresIn:'30s'
      }
      console.log(user.username)
      const reqUsername=req.body.username
      const password=req.body.password
      console.log(req.body.username)
      if(user.username===reqUsername && user.password===password){
        refreshToken=refreshToken()
        jwt.sign({user},'structo',expiry,(err,token)=>{
            res.json({
                "token":{
                    "accessToken":token,
                    "refreshToken":refreshToken
                }
            })
        })
    }else{
        res.json({
            "message": "Invalid User"
        })
    }
      
})
app.post('/regenerateToken',(req,res)=>{
    const expiry={
        expiresIn:'5s'
    }
    const reqRefreshToken=req.body.refreshToken
    
    console.log(reqRefreshToken)
    if(reqRefreshToken===refreshToken){
        jwt.sign({user},'structo',expiry,(err,token)=>{
          res.json({
              "token":{
                  "accessToken":token
                }
          })
      })
  }else{
      res.json({
          "message": "Invalid refresh token"
      })
  }
    
})

function refreshToken(){
    const expiry={
         expiresIn:'1y'
     }
     console.log(user.username)
     return jwt.sign({user},'refreshstructo',expiry)
    }
function verifyToken(req,res,next){
    const bHeader=req.headers['authorization']
    if(typeof bHeader!=='undefined'){

        const bearer=bHeader.split(' ');
        const bToken=bearer[1]
        req.token=bToken;
        next();
    }else{
        res.sendStatus(403)
    }
}


app.listen(8080,()=>console.log('server started on 8080'))

