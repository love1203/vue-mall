const validator=require('validator');
const isEmpty=require('./is-empty');

module.exports=function validatorlogin(data) {
    data.password=!isEmpty(data.password)?data.password:'';
    data.email=!isEmpty(data.email)?data.email:'';
    let errors={};
    if(!validator.isLength(data.password,{min:3,max:10})){
        errors.password='密码不能小于3位并不能大于10位'
    }
    if(validator.isEmpty(data.password)){
        errors.password='密码不能为空'
    }
    if(!validator.isEmail(data.email)){
        errors.email='邮箱格式不正确'
    }
    if(validator.isEmpty(data.email)){
        errors.email='邮箱不能为空'
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }

};