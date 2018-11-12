const validator=require('validator');
const isEmpty=require('./is-empty');

module.exports=function validatorgoods(data) {
    data.goodsname=!isEmpty(data.goodsname)?data.goodsname:'';
    data.goodsimg=!isEmpty(data.goodsimg)?data.goodsimg:'';
    data.goodsprice=!isEmpty(data.goodsprice)?data.goodsprice:'';
    data.goodssku=!isEmpty(data.goodssku)?data.goodssku:'';
    let errors={};

    if(validator.isEmpty(data.goodsname)){
        errors.goodsname='名称不能为空'
    }
    if(validator.isEmpty(data.goodsimg)){
        errors.goodsimg='图片不能为空'
    }
    if(validator.isEmpty(data.goodsprice)){
        errors.goodsprice='价格不能为空'
    }
    if(validator.isEmpty(data.goodssku)){
        errors.goodssku='颜色不能为空'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }

};