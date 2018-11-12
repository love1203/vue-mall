const validator=require('validator');
const isEmpty=require('./is-empty');

module.exports=function validatorregister(data) {
  data.name=!isEmpty(data.name)?data.name:'';
  data.password=!isEmpty(data.password)?data.password:'';
  data.password2=!isEmpty(data.password2)?data.password2:'';
  data.email=!isEmpty(data.email)?data.email:'';
  let errors={};
  if(!validator.isLength(data.name,{min:3,max:10})){
      errors.name='用户不能小于3位并不能大于10位'
  }
  if(validator.isEmpty(data.name)){
      errors.name='用户名不能为空'
  }
    if(!validator.isLength(data.password,{min:3,max:10})){
        errors.password='密码不能小于3位并不能大于10位'
    }
    if(validator.isEmpty(data.password)){
        errors.password='密码不能为空'
    }
    if(!validator.isLength(data.password2,{min:3,max:10})){
        errors.password2='密码不能小于3位并不能大于10位'
    }
    if(validator.isEmpty(data.password2)){
        errors.password2='密码不能为空'
    }
    if(!validator.isEmail(data.email)){
        errors.email='邮箱格式不正确'
    }
    if(validator.isEmpty(data.email)){
        errors.email='密码不能为空'
    }
    if(!validator.equals(data.password,data.password2)){
        errors.password2='两次密码输入不一致'
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }

};