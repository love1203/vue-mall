const express=require('express');
const router=express.Router();
const passport=require('passport');
const Goods=require('../../models/Goods');
const validatorgoods=require('../../validation/goods');

router.get('/text',(req,res)=>{
   res.json({mag:"text"})
});

//获取全部数据 /api/goods

router.get('/',(req,res)=>{
   Goods.find()
       .then(goods=>{
           if(goods.length==0){
               return res.status(404).json({ongoods:'没有任何商品'})
           }else {
               res.json(goods)
           }
       })
});


//添加商品 /api/goods/add

router.post('/add',passport.authenticate('jwt', { session: false }),(req,res)=>{

    const {errors,isValid} = validatorgoods(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

    const newgoods={};
    newgoods.goodsname=req.body.goodsname;
    newgoods.goodsimg=req.body.goodsimg;
    newgoods.goodsprice=req.body.goodsprice;
    newgoods.goodssku=req.body.goodssku.split('，');
    Goods(newgoods).save()
        .then(goods=>res.json(goods))
});

//通过id获取商品 /api/goods/:id
router.get('/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Goods.findOne({_id:req.params.id})
        .then(goods=>{
            if(!goods){
                return res.status(404).json({ongoods:'没有找到商品'})
            }else {
                res.json(goods)
            }
        })
})


//删除商品 /api/goods/de/:id
router.delete('/de/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
   Goods.findOneAndRemove({_id:req.params.id})
       .then(goods=>res.json(goods))
       .catch(err=>res.status(404).json({ongoods:'未找到商品'}))
});

//更改商品 /api/goods/:id
router.post('/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const {errors,isValid} = validatorgoods(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const newgoods={};
    newgoods.goodsname=req.body.goodsname;
    newgoods.goodsimg=req.body.goodsimg;
    newgoods.goodsprice=req.body.goodsprice;
    newgoods.goodssku=req.body.goodssku.split('，');
   Goods.findOneAndUpdate({_id:req.params.id},{$set:newgoods},{new:true})
       .then(goods=>res.json(goods))
});

module.exports=router;