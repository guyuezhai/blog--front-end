/**
 * Created by asus1 on 2017/4/21.
 */
$().extend('serialize',function () {

    for(var i=0;i<this.elements.length;i++){
        var form=this.elements[i];
        var parts={};
        for(var i=0;i<form.elements.length;i++){
            var filed=form.elements[i];
            switch(filed.type){
                case undefined:
                case 'submit':
                case 'reset':
                case 'file':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if(!filed.selected) break;
                case 'select-one':
                case 'select-multiple':
                    for(var j=0;j<filed.options.length;j++){
                        var option=filed.options[j];
                        if(option.selected){
                            var optValue='';
                            if(option.hasAttribute){		//当value属性存在的情况取value值，不存在情况取text值
                                optValue=option.hasAttribute('value')?option.value:option.text;			//非IE
                            }else{
                                optValue=option.attributes('value').specified?option.value:option.text; //IE
                            }
                            parts[filed.name]=optValue;
                        }
                    }
                    break;
                default:
                    parts[filed.name]=filed.value;
            }
        }
        return parts;
    }
    return this;
});