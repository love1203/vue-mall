const mongoose=require('mongoose');
const Scheam=mongoose.Schema;

let cartlistschema=new Scheam({
    userid:{
        type:Scheam.Types.ObjectId,
        ref:'users'
    },
    "orderList":[
        {
            dingdaninfo:String,
            dateinfo:String,
            dizhiinfo:Object,
            fapiaoinfo:String,
            zjinfo:String,
            checkoutcartdata:Array,
            isPay:{
                type:Boolean,
                default: false
            }
        }
    ],
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":String,
            "productImage":String,
            "productsku":Array,
            "checked":Boolean,
            "productNum":String
        }
    ],
    "addressList":[
        {
            "name": String,
            "phone": String,
            "areaCode": String,
            "landLine": String,
            "province": String,
            "city": String,
            "county": String,
            "add": String,
            checked:{
                type: Boolean,
                default:false
            }
        }
    ]
});




module.exports=Cartlist=mongoose.model('carts',cartlistschema);