const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let goodsschema=new Schema({
    goodsname:{
        type:String,
        required:true
    },
    goodsprice:{
        type:String,
        required:true
    },
    goodsimg:{
        type:String,
        required:true
    },
    goodssku:{
        type:Array,
        required:true
    }
});

module.exports=Goods=mongoose.model('goods',goodsschema)
