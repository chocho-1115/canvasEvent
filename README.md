---
title: canvasEvent介绍
---

[github canvasEvent.js](https://github.com/chocho-1115/canvasEvent/)

一个给canvas内部添加事件相应区域的js库。支持鼠标响应与触屏响应，简单易用，无需重绘画布元素。

### 初始化事件
``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);
```
支持'out','over','move','down','up','click'六种事件。 新建ces对象后，会根据初始化的事件类型和设备类型，给canvas添加相应的事件。如果是手机设备初始化down事件后，canvas会注册touchstart。pc端当然是mousedown事件。

你也可以通过enabled方法来初始化事件
``` javascript
var ces = new CE.Stage(canvas,['out','over','move']);
ces.enabled('down','up','click')
```
禁用事件 用disabled，用法和enabled类似。

### 添加响应区域
事件响应区域支持‘rect’，‘arc’，‘polygon’三种类型：

``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);
var A1 = new CE.Area('rect',{x:50,y:50,width:100,height:100});
var A2 = new CE.Area('arc',{x:300,y:300,radius:100,startAngle:0,endAngle:-90});
var A3 = new CE.Area('polygon',{points:[
		{x:400,y:50},
		{x:400,y:150},
		{x:500,y:150},
		
		{x:500,y:110},
		{x:480,y:140},
		
		{x:450,y:100},
		
		{x:480,y:60},
		{x:500,y:90},
		
		{x:500,y:50}
	]});
ces.addChild(A1,A2,A3);
```

### 添加事件

给事件响应区域添加的事件必须是ces对象初始话的事件。没有初始化的事件，添加后是没响应的。

``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);
var A1 = new CE.Area('rect',{x:50,y:50,width:100,height:100});
	ces.addChild(A1)
	A1.addEvent('down',function(e){
		console.log(this)//这里的this指向的是A1
		text.innerHTML += ' | down';
	})
	A1.addEvent('up',function(e){
		text.innerHTML += ' | up';
	})
	A1.addEvent('click',function(e){
		text.innerHTML += ' | click';
	})
	
	
	A1.addEvent('over',function(e){
		text.innerHTML += ' | over';
	})
	A1.addEvent('out',function(e){
		text.innerHTML += ' | out';
	})
	A1.addEvent('move',function(e){
		text.innerHTML += ' | move';
	})
```
















