function startMove(obj,json,fn){//利用轻量级存储变量Json作为参数从而达到同时运动的目的
  var flag=true;
  clearInterval(obj.timer);
  obj.timer = setInterval(function(){
    for(var str in json){
      var icur=0;
      if(str=='opacity'){
        icur=parseFloat(getStyle(obj,str))*100;
      }
      else{
        icur=parseInt(getStyle(obj,str));
      }
      var speed=(json[str]-icur)/2;
      speed=speed>0?Math.ceil(speed):Math.floor(speed);
      if(icur!=json[str]){
        flag=false;
      }
      
      if(flag){
        clearInterval(obj.timer);
        fn && fn();
      }
      else{
        if(str=='opacity'){
          obj.style.filter='alpha(opacity:'+(icur+speed)+')';
          obj.style.opacity=(icur+speed)/100;
        }
        else{
          obj.style[str]=icur+speed+'px';
        }	
      }
      }

  },30)
}

function getStyle(obj,attr){
  if(obj.currentStyle){
    return obj.currentStyle[attr];
  }
  else{
    return getComputedStyle(obj,false)[attr];
  }
}//获取样式函数,为解决offsetWidth等把边框包含进去没办法达到预期效果的缺陷