const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const passport=require('passport');
const User=require('../../models/User');
const keys=require('../../config/keys');
const validatorregister=require('../../validation/register');
const validatorlogin=require('../../validation/login');

router.get('/text',(req,res)=>{
   res.json({mag:'text'})
});

//注册 /api/users/register

router.post('/register',(req,res)=>{
    const {errors,isValid} = validatorregister(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
   User.findOne({email:req.body.email})
       .then((user)=>{
           if(user){
               return res.status(400).json({email:'邮箱已被注册'})
           }else {
               const avatar=gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
               let newuser={
                   name:req.body.name,
                   email:req.body.email,
                   avatar,
                   guanli:req.body.guanli,
                   password:req.body.password
               }
               bcrypt.genSalt(10, function(err, salt) {
                   bcrypt.hash(newuser.password, salt, function(err, hash) {
                       if(err) throw err;
                       newuser.password=hash;
                       User(newuser).save()
                           .then(user=>res.json(user))
                   });
               });
           }
       })
});


//登录 /api/users/login

router.post('/login',(req,res)=>{

    const {errors,isValid} = validatorlogin(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

   User.findOne({email:req.body.email})
       .then(user=>{
           if(!user){
               return res.status(400).json({email:'邮箱不存在'})
           }else {
               bcrypt.compare(req.body.password, user.password)
                   .then(ismatch=>{
                       if(ismatch){
                           let rule={
                               id:user._id,
                               name:user.name,
                               avatar: user.avatar,
                               email:user.email,
                               guanli: user.guanli
                           };
                           jwt.sign(rule,keys.secretOrKey,{expiresIn: 3600},(err,token)=>{
                               if(err) throw err;
                               res.json({
                                   success:true,
                                   token:"Bearer " + token
                               })
                           })

                       }else {
                           return res.status(400).json({password:'密码错误'})
                       }
                   })
           }
       })
});


//管理员登录 /api/users/admin

router.post('/admin',(req,res)=>{

    const {errors,isValid} = validatorlogin(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }


    User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(404).json({email:'邮箱不存在'})
            }else {
                if(user.guanli!=0){
                    return res.status(400).json({email:'该用户不是管理员'})
                }else {
                    bcrypt.compare(req.body.password, user.password)
                        .then(ismatch=>{
                            if(ismatch){
                                let rule={
                                    id:user._id,
                                    name:user.name,
                                    avatar: user.avatar,
                                    email:user.email,
                                    guanli: user.guanli
                                };
                                jwt.sign(rule,keys.secretOrKey,{expiresIn: 3600},(err,token)=>{
                                    if(err) throw err;
                                    res.json({
                                        success:true,
                                        token:"Bearer " + token
                                    })
                                })

                            }else {
                                return res.status(400).json({password:'密码错误'})
                            }
                        })
                }
            }
        })
});




router.get("/current",passport.authenticate('jwt', { session: false }),(req,res) => {
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    });
});

module.exports=router;