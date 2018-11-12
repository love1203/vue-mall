const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let userschema=new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    avatar:{
        type: String
    },
    password:{
        type: String,
        required:true
    },
    guanli:{
        type: String,
        default:'1'
    }
});

module.exports=User=mongoose.model('users',userschema);