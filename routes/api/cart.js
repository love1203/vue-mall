const express=require('express');
const router=express.Router();
const passport=require('passport');
const Cart=require('../../models/cartlist');


router.get('/text',passport.authenticate('jwt', { session: false }),(req,res)=>{
   res.json({mag:'text'})
});


//加入购物车 /api/cart/add
router.post('/add',passport.authenticate('jwt', { session: false }),(req,res)=>{
    //console.log(req.user);


    const newcartdata={
        userid:req.user._id,
        orderList:[],
        cartList:[
            {
                productId:req.body.itemcart._id,
                productName:req.body.itemcart.goodsname,
                salePrice:req.body.itemcart.goodsprice,
                productImage:req.body.itemcart.goodsimg,
                productsku:req.body.itemcart.goodssku,
                checked:true,
                productNum:'1'
            }
        ]
    };

    const newcart={
        productId:req.body.itemcart._id,
        productName:req.body.itemcart.goodsname,
        salePrice:req.body.itemcart.goodsprice,
        productImage:req.body.itemcart.goodsimg,
        productsku:req.body.itemcart.goodssku,
        checked:true,
        productNum:'1'
    }

    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            if(!cart){
                Cart(newcartdata).save()
                    .then(cart=>{
                        res.json(cart)
                    })
            }else {
                let car='';
                cart.cartList.forEach(item=>{
                    if(item.productId==req.body.itemcart._id){
                        car=item;
                        item.productNum++;
                    }

                });
                if(car){
                    cart.save()
                        .then(cart=>{
                            res.json(cart)
                        })
                }else{
                    cart.cartList.unshift(newcart);
                    cart.save()
                        .then(cart=>{
                            res.json(cart)
                        })
                }

            }
        })
});


//获取购物车数据 /api/cart/all
router.get('/all',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            if(!cart){
                return res.status(404).json({oncart:'购物车没有任何数据'})
            }else {
                if(cart.cartList.length==0){
                    res.json(cart)
                }else {
                    res.json(cart)
                }
            }
        })
});


//增加数量 /api/cart/change
router.post('/change',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            if(cart){
                cart.cartList.forEach((item)=>{
                    if(item.productId==req.body.productId){
                        item.productNum=req.body.itemcount;
                        item.checked=req.body.itemchecked;
                        //console.log(item.checked)
                        //console.log(item.productNum)
                        cart.save()
                            .then(cart=>res.json(cart))
                    }
                })
            }
        })
});



//全选 /api/cart/allchange

router.post('/allchange',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            if(cart){
                cart.cartList.forEach((item)=>{
                    item.checked=req.body.allchecked;
                    //console.log(item.checked)

                });
                cart.save()
                    .then(cart=>res.json(cart))
                    .catch(err=>res.json(err))
            }
        })
});

//删除购物车数据 /api/cart/removecart
// router.post('/removecart',passport.authenticate('jwt', { session: false }),(req,res)=>{
//     Cart.findOne({userid:req.user._id})
//         .then(cart=>{
//             //console.log(req.body.productId)
//             if(cart.cartList.length>0){
//                 let removeindex=cart.cartList.map(item=>item.productId.toString()).indexOf(req.body.productId)
//                 cart.cartList.splice(removeindex,1)
//                 cart.save()
//                     .then(cart=>res.json(cart))
//             }
//
//         })
// });

router.post('/removecart',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.update({userid:req.user._id},{$pull:{'cartList':{productId:req.body.productId}}})
        .then(cart=>{
            res.json(cart)
        })
});


//添加地址 /api/cart/address
router.post('/address',passport.authenticate('jwt', { session: false }),(req,res)=>{
    //console.log(req.body.name)
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            let newaddress={
                name:req.body.name,
                phone:req.body.phone,
                areaCode:req.body.areaCode,
                landLine:req.body.landLine,
                province:req.body.province,
                city:req.body.city,
                county:req.body.county,
                add:req.body.add,
                checked:req.body.checked
            };
            if(req.body.checked==true){
                cart.addressList.forEach(item=>{
                    item.checked=false
                })
            }
            cart.addressList.push(newaddress)
            //console.log(cart.addressList)
            cart.save()
                .then(cart=>{
                    res.json(cart)
                })
        })
});


//删除地址 /api/cart/removeaddress
// router.post('/removeaddress',passport.authenticate('jwt', { session: false }),(req,res)=>{
//     //console.log(req.body.id)
//    Cart.update({userid:req.user._id},{$pull: {'addressList':{_id:req.body.id}}})
//        .then(cart=>{
//            res.json(cart)
//        })
// });

router.post('/removeaddress',passport.authenticate('jwt', { session: false }),(req,res)=>{
    //console.log(req.body.id)
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            //cart.addressList.map(item=>item._id)
            let remoindex=cart.addressList.map(item=>item._id.toString()).indexOf(req.body.id)
            cart.addressList.splice(remoindex,1)
            cart.save()
                .then(res.json(cart))
        })
});


//编辑地址
router.post('/updataaddress',passport.authenticate('jwt', { session: false }),(req,res)=>{
   Cart.findOne({userid:req.user._id})
       .then(cart=>{
           let newaddress={
               name:req.body.name,
               phone:req.body.phone,
               areaCode:req.body.areaCode,
               landLine:req.body.landLine,
               province:req.body.province,
               city:req.body.city,
               county:req.body.county,
               add:req.body.add,
               checked:req.body.checked
           };
           if(req.body.checked==true){
               cart.addressList.forEach(item=>{
                   item.checked=false
               })
           }
           cart.addressList.forEach(item=>{

               if(item._id==req.body._id){
                   item.name=req.body.name;
                   item.phone=req.body.phone;
                   item.areaCode=req.body.areaCode;
                   item.landLine=req.body.landLine;
                   item.province=req.body.province;
                   item.city=req.body.city;
                   item.county=req.body.county;
                   item.add=req.body.add;
                   item.checked=req.body.checked;
                   cart.save()
                       .then(cart=>res.json(cart))
               }
           })
       })
});

//选中地址 /api/cart/checkaddress
router.post('/checkaddress',passport.authenticate('jwt', { session: false }),(req,res)=>{
    //console.log(req.body.item._id)
   Cart.findOne({userid:req.user._id})
       .then(cart=>{
           //console.log(cart.addressList)
           cart.addressList.forEach(item=>{
               item.checked=false;
               if(item._id==req.body.item._id){
                   item.checked=true
               }
           })
           cart.save()
               .then(cart=>res.json(cart))
       })
});


//添加订单 /api/cart/order
router.post('/order',passport.authenticate('jwt', { session: false }),(req,res)=>{
   Cart.findOne({userid:req.user._id})
       .then(cart=>{
           let neworderdata={
               dingdaninfo:req.body.dingdaninfo,
               dateinfo:req.body.dateinfo,
               dizhiinfo:req.body.dizhiinfo,
               fapiaoinfo:req.body.fapiaoinfo,
               zjinfo:req.body.zjinfo,
               checkoutcartdata:req.body.checkoutcartdata
           }
           cart.orderList.unshift(neworderdata)
           cart.save()
               .then(res.json(cart))
       })
});

//删除购物车选中数据 /api/cart/removecheckeddata
router.delete('/removecheckeddata',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            let i=cart.cartList.length;
            while (i--){
                if(cart.cartList[i].checked){
                    cart.cartList.splice(i,1)
                }
            }
            cart.save()
                .then(cart=>res.json(cart))
        })
});


//付款 /api/cart/ispay
router.post('/ispay',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Cart.findOne({userid:req.user._id})
        .then(cart=>{
            cart.orderList.forEach(item=>{
                if(item.dingdaninfo==req.body.dingdaninfo){
                    item.isPay=true
                }
            });
            cart.save()
                .then(cart=>res.json(cart))
        })
});

module.exports=router;