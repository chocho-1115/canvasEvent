
## canvasEvent介绍


[github canvasEvent.js](https://github.com/chocho-1115/canvasEvent/)

一个给canvas内部添加事件响应区域的js库。支持鼠标响应与触屏响应，简单易用，无需重绘画布元素。

**原理**：在canvas注册响应的事件，并给canvas内部添加几何响应区域。当交互发时，判断事件是否发生在几何响应区域。如果交互发生在几何响应区域时，响应该区域注册的事件。

### 初始化事件
``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);
```
支持'out','over','move','down','up','click'六种事件。 新建ces对象后，会根据初始化的事件类型和设备类型，给canvas添加响应的事件。如果是手机设备初始化down事件后，canvas会注册touchstart。pc端当然是mousedown事件。

你也可以通过enabled方法来初始化事件
``` javascript
var ces = new CE.Stage(canvas,['out','over','move']);
ces.enabled('down','up','click')
```
禁用事件 用disabled，用法和enabled类似。

### 添加响应区域
事件响应区域支持三种类型：

第一种**rect类型**-矩形事件响应区域
``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);

var rect = new CE.shape.Rect(100,100,{x:150,y:150,regX:0,regY:0});//width，height，位置信息
var A1 = new CE.Area(rect);

ces.addChild(A1)

```

第二种**arc类型**-扇形事件响应区域


``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);

var arc = new CE.shape.Arc(100,0,-90,{x:400,y:400,regX:100,regY:100}));//radius 开始角度 结束角度 位置信息
var A1 = new CE.Area();
A1.shape = arc;

ces.addChild(A1);


```

第二种**polygon类型**-任意形状事件响应区域


``` javascript
var ces = new CE.Stage(canvas,['out','over','move','down','up','click']);

var Polygon = new CE.shape.Polygon([
		{x:100,y:0},
		{x:100,y:100},
		{x:400,y:100},
		
		{x:400,y:60},
		{x:380,y:90},
		
		{x:350,y:50},
		
		{x:380,y:10},
		{x:400,y:40},
		
		{x:500,y:0}
	],{x:200,y:200,regX:100,regY:100});//顶点坐标数组，位置信息
var A1 = new CE.Area(polygon);


ces.addChild(A1);
```

### 添加事件

给事件响应区域添加的事件必须是初始话了的事件。没有初始化的事件，添加后是没响应的。

``` javascript
var ces = new CE.Stage(canvas,['out','over','move']);
ces.enabled('down','up','click')

var A1 = new CE.Area(new CE.shape.Rect(100,100,{x:150,y:150,regX:0,regY:0}));
ces.addChild(A1)
A1.addEvent('down',function(e){
	console.log(this);//这里的this指向了A1
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

### 事件穿透
当事件响应区域发生叠加的时候，默认情况下是不会触发底层区域的事件的。如果在这种情况下需要触发底层的事件，可以通过setPenetrate方法来实现。

假如有层A1和A2相互重叠，A1在上面，A2在下面，A2注册有click事件。默认情况下点击重叠区域是无法触发A2的点击事件的，如果想要触发底层A2的点击事件，我们需要在上层A1上这样设置：
``` javascript
A1.setPenetrate('click',true);

```
这里需要注意的是，如果你设置了out的事件穿透，那么必须在底层事件区域发生了over事件之后，底层的out事件才会触发。这里说的底层发生over事件，并不代表底层必须注册over事件。






