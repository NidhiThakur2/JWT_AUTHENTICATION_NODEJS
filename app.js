//external Library import
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser=require('body-parser')

const app = express();
//declare user object
const user={
    username:'admin',
    password:'password'
}
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var refreshToken;
app.use(express.json())
app.use(express.Router())
//test api
app.get('/api',(req,res)=>{
    res.json({
        message:'Welcome to the API'
    })
})
//If token sent in header is correct  API responsse : "Hello World"
//If token sent in header is not correct  API responsse : UnAuthorized
//Calling verifyToken Middleware function to verify the token before sending the response
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

//After verifying the user credentials API will return accessToken (which needs to be sent in /about api header) and
// refreshToken(which needs to be sent in /regenerateToken api header  )
app.post('/token',(req,res)=>{
     const expiry={
          expiresIn:'30s'
      }
      console.log(user.username)
      const reqUsername=req.body.username
      const password=req.body.password
      console.log(req.body.username)
      if(user.username===reqUsername && user.password===password){
        //calling function to get the refresh token
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

//If refresh token sent in header is correct API response : new access token 
//If refresh token sent in header is not correct API response : "Invalid refresh token please login again."
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
          "message": "Invalid refresh token please login again."
      })
  }
    
})
//function to generate refresh Token
function refreshToken(){
    const expiry={
         expiresIn:'1y'
     }
     console.log(user.username)
     return jwt.sign({user},'refreshstructo',expiry)
    }

//function to verify access token
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

//starting the server on port 8080
app.listen(8080,()=>console.log('server started on 8080'))

