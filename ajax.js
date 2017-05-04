/**
 * Created by asus1 on 2017/4/20.
 */
//封装AJAX
function ajax(obj){
    var xhr=(function () {          //跨浏览器创建XHR对象
        if(typeof XMLHttpRequest!='undefined'){			//非IE浏览器
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject!='undefined'){	//IE浏览器
            var version=[
                'MSXML2.XMLHttp.6.0',
                'MSXML2.XMLHttp.3.0',
                'MSXML2.XMLHttp'
            ];
            for (var i = 0; i < version.length; i++) {
                try{
                    return new ActiveXObject(version[i]);
                }catch(e){
                    //跳过
                }

            }
        }else{
            throw new Error('您的系统或浏览器不支持XHR对象！');
        }
    })();
    obj.url=obj.url+'?rand='+Math.random();
    obj.data=(function (data) {     //名值对转换为字符串，对特殊发号编码的问题
        var arr=[];
        for(var i in data){
            arr.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);
    if(obj.method==='get') obj.url+=obj.url.indexOf('?')==-1?'?'+obj.data:'&'+obj.data;
    if(obj.async===true){		//异步
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                callback();
            }
        };
    }
    xhr.open(obj.method,obj.url,obj.async);
    if(obj.method==='post'){
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');//第三步，模拟表单提交  设置请求头信息
        xhr.send(obj.data);
    }else{
        xhr.send(null);
    }

    if(obj.async===false){	//同步
        callback();
    }

    function callback(){
        if(xhr.status==200){
            obj.success(xhr.responseText);  //回调传参数
        }else{
            alert('获取数据错误！错误代号：'+xhr.status+',错误信息：'+xhr.statusText);
        }
    }
}

