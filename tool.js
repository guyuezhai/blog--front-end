/*
obj.attachEvent('on'+type,function(){ //IE
			fn.call(obj,window.event)
		});
*/
//浏览器检测
(function(){
	window.sys={};	//让外部可以访问，保存浏览器信息
	var ua=navigator.userAgent.toLowerCase();	//获取浏览器信息字符串
	var s;	
	(s=ua.match(/mise([\d.]+)/))?sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/))?sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/))?sys.chrome=s[1]:
	(s=ua.match(/opera\/.*version\/([\d.]+)/))?sys.chrome=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/))?sys.chrome=s[1]:0;
	//(s=ua.match(/webkit\/([\d.]+)))?sys.webkit=s[1]:0;
	if(/webkit/.test(ua)) sys.webkit=ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn){
	var isReady=false;
	var timer=null;
	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady=true;
		fn();
	}
	//先判断非主流浏览器
	if((sys.opera&&sys.opera<9)||(sys.firefox&&sys.firefox<3)||(sys.webkit&&sys.webkit<525)){
		//第一种方法
		// timer=setInterval(function(){
		// 	if(/loaded|complete/.test(document.readyState)){ //loaded是部分加载，
		// 		doReady();
		// 	}
		// },1);
		第二种方法
		timer=setInterval(function(){
			if(document&&document.getElementById&&document.getElementsByTagName&&document.body){ //这四个同时存在，则DOM加载完毕了
				doReady();
			}
		},1);
	}else if(document.addEventListener){	//W3C
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			//alert(arguments.callee);	//打印匿名函数的方法
			removeEvent(document,'DOMContentLoaded',arguments.callee);	//删除匿名函数事件的方法
		});
	}else if(sys.ie&&sys.ie<9){
		var timer=null;

		timer=setInterval(function(){
			try{
				document.documentElement.doScroll('left'); //IE
				doReady();
			}catch(e){}
		},1);
	}
}


//跨浏览器添加事件绑定
function addEvent(obj,type,fn){
	if(typeof obj.addEventListener!='undefined'){
		obj.addEventListener(type,fn,false);
	}else{
		//创建一个存放事件的哈希表（散列表）
		if(!obj.events) obj.events={};
		//第一次执行时
		if(!obj.events[type]){
			//创建一个存放事件处理函数的数组
			obj.events[type]=[];
			//把第一次的事件处理函数先存储到第一个位置上
			if(obj['on'+type]) obj.events[type][0]=fn;
		}else{
			//同一个注册函数进行屏蔽，不添加到计数器中
			if(addEvent.equal(obj.events[type],fn)) return false;
		}

		//从第二次开始我们用事件计数器来存储
		obj.events[type][addEvent.id++]=fn;
		//执行事件处理函数
		obj['on'+type]=addEvent.exec;
	}
}


//为每一个事件分配一个计数器
addEvent.id=1;


//执行事件处理函数
addEvent.exec=function(event){
	var e=event||addEvent.fixEvent(window.event);
	var es=this.events[e.type];
	for(var i in es){
		es[i].call(this,e);
	}
}

//同一个注册函数进行屏蔽
addEvent.equal=function(es,fn){
	for(var i in es){
		if(es[i]==fn) return true;
	}
	return false;
}
//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent=function(event){
	event.preventDefault=addEvent.fixEvent.preventDefault;
	event.stopPropagation=addEvent.fixEvent.stopPropagation;
	event.target=event.srcElement;
	return event;
}
//IE阻止默认行为
addEvent.fixEvent.preventDefault=function(){
	this.returnValue=false;
}
//IE取消冒泡
addEvent.fixEvent.stopPropagation=function(){
	this.cancelBubble=true;
}

//跨浏览器删除事件绑定
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener!='undefined'){
		obj.removeEventListener(type,fn,false);
	}else{
		if(obj.events){
			for(var i in obj.events[type]){
				if(obj.events[type][i]==fn){
					delete obj.events[type][i];
				}
			}
		}
		
	}
}
//跨浏览器获取视口
function getInner() {
	if(typeof window.innerWidth!='undefined'){
		return{
			width:window.innerWidth,
			height:window.innerHeight
		}
	}else{
		return{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}

//跨浏览器获取滚动条位置
function getScroll(){
	return{
		top:document.body.scrollTop||document.documentElement.scrollTop,
		left:document.body.scrollLeft||document.documentElement.scrollLeft
	}
}

//跨浏览器获取Style
function getStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle!='undefined'){	//W3C
		value=window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle!='undefined'){	//IE
		value=element.currentStyle[attr];
	} 
	return value;
}

//判断class是否存在

function hasClass(element,className){
	return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}


//跨浏览器添加link规则
function insertRule(sheet,selectorText,cssText,position){
	if(typeof sheet.insertRule!='undefined'){	//W3C
		sheet.insertRule(selectorText+'{'+cssText+'}',position);
	}else if(typeof sheet.addRule!='undefined'){	//IE
		sheet.addRule(selectorText,cssText,position);
	}
}

//跨浏览器移除link规则
function deleteRule(sheet,index){
	if(typeof sheet.deleteRule!='undefined'){	//W3C
		sheet.deleteRule(index);
	}else if(typeof sheet.removeRule!='undefined'){	//IE
		sheet.removeRule(index);
	}
}

/*//获取Event对象
function getEvent(event){
	return event||window.event;
}

//阻止默认行为
function preDef(event){
	var e=getEvent(event);
	if(typeof e.preventDefault!='undefined'){	//W3C
		e.preventDefault();
	}else{
		e.returnValue=false; 	//IE
	}
}
*/
//跨浏览器获取innerText
function getInnerText(element){
	return (typeof element.textContent=='string')?element.textContent:element.innerText;
}
//跨浏览器设置innerText
function setInnerText(element,text){
	if(typeof element.textContent=='string'){
		return element.textContent=text;
	}else{
		return element.innerText=text;
	}
}

//获取某一个元素到最外层顶点的位置
function offsetTop(element) {
	var top=element.offsetTop;
	var parent=element.offsetParent;
	while(parent!=null){
		top+=parent.offsetTop;
		parent=parent.offsetParent;
	}
	return top;
}
//删除左右空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}
//判断某一个值是否在某一个数组里面
function inArray(array,value){
	for(var i in array){
		if(array[i]===value)
			return true;
	}
	return false;
}

//获取某一个节点的上上一个节点的索引
function prevIndex(current,parent) {
    var length=parent.children.length;
    if(current==0) return length-1;
    return parseInt(current)-1;
}
//获取某一个节点的上下一个节点的索引
function nextIndex(current,parent) {
    var length=parent.children.length;
    if(current==length-1) return 0;
    return parseInt(current)+1;
}

//滚动条固定
function fixedScroll() {
	setTimeout(function () {
        window.scrollTo(fixedScroll.left,fixedScroll.top);
    },100);

}
//滚动条清零
function scrollTop(){
	document.documentElement.scrollTop=0;
	document.body.scrollTop=0;
}
//阻止默认行为
function predef(e) {
	e.preventDefault();
}


//设置cookie
function setCookie(name,value,expires,path,domain,secure){
	var cookieName=encodeURIComponent(name)+'='+encodeURIComponent(value);
	if(expires instanceof Date){
		cookieName+=';expires='+expires;
	}
	if(path){
		cookieName+=';path='+path;
	}
	if(domain){
		cookieName+=';domain='+domain;
	}
	if(secure){
		cookieName+=';secure';
	}
	document.cookie=cookieName;
}

//设置cookie失效时间
function setCookieDate(day){
	var date=null;
	if(typeof day=='number'&&day>0){
		date=new Date();
		date.setDate(date.getDate()+day);
	}else{
		throw new Error('您输入的时间有误，请重新输入！');
	}
	return date.toGMTString();
}


//获取cookie
function getCookie(name){
	var cookieName=encodeURIComponent(name)+'=';
	var cookieStart=document.cookie.indexOf(cookieName);
	var cookieValue=null;
	var cookieEnd=document.cookie.indexOf(';',cookieStart);
	if(cookieEnd==-1){
		cookieEnd=document.cookie.length;
	}
	cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
	return cookieValue;
} 
































































































































































