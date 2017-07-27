// canvasEvent.js Javascript Library by hylink 杨燚平 2017-07-27 email:849890769@qq.com
//https://github.com/chocho-1115
(function(window){
	
	window.canvasEvent = window.CE = {};
	
	CE.Stage = function(canvas,regEvent){
		
		var self = this;
		var isTouch =  'ontouchstart' in document ? true : false;
		
		if(canvas.currentStyle){
			this.borderLeftWidth = parseFloat(canvas.currentStyle['borderLeftWidth']);
			this.borderTopWidth = parseFloat(canvas.currentStyle['borderTopWidth']);
		}else{
			this.borderLeftWidth = parseFloat(getComputedStyle(canvas, null)['borderLeftWidth']);
			this.borderTopWidth = parseFloat(getComputedStyle(canvas, null)['borderTopWidth']);
		}
		
		this.deviceType = isTouch ? 'touch' : 'mouse';
		this.canvas = canvas;
		this.areas = [];
		this.childLength = 0;
		this.regEvent = {
			down : { status:false, name: 'mousedown'},
			up : { status:false, name: 'mouseup'},
			click : { status:false, name: 'click'},
			over : { status:false, name: 'mousemove'},
			out : { status:false, name: 'mousemove'},
			move : { status:false, name: 'mousemove'}
		};
		
		if(isTouch){
			this.regEvent.down.name = 'touchstart';
			this.regEvent.up.name = 'touchend';
			
			this.regEvent.over.name = 'touchmove';
			this.regEvent.out.name = 'touchmove';
			this.regEvent.move.name = 'touchmove';
			
		}
		
		self.enabled.apply(this,regEvent);
	
	}
	
	CE.Stage.prototype = {
		constructor: CE.Stage,
		//启用
		enabled:function(){
			var len = arguments.length,
				self = this;

			for(var i=0;i<len;i++){
				var inEvent = arguments[i];
				addEvent(inEvent);
			}
			
			//给画布添加事件
			function addEvent(inEvent){
				
				if(!self.regEvent[inEvent])return false
				
				//防止事件重复注册
				if(self.regEvent[inEvent].status)return false;
				if (inEvent=='over'||inEvent=='move'||inEvent=='out'){
					if(self.regEvent['over'].status||self.regEvent['move'].status||self.regEvent['out'].status){
						self.regEvent[inEvent].status = true;
						return false;
					}
				}
				self.regEvent[inEvent].status = true;
				
				//添加over out move 事件
				if(self.regEvent[inEvent].name == self.deviceType + 'move'){
					self.canvas['on'+self.regEvent[inEvent].name] = function(e){
						var offset = self.getEventOffset(e);
						for(var i=0;i<self.childLength;i++){
							var thisAreas = self.areas[i];
							//console.log(thisAreas.isInArea(offset.x,offset.y))
							var isIn = thisAreas.isInArea(offset.x,offset.y);
							if(isIn){
								if(thisAreas.status==-1){
									inEvent = 'over';
									thisAreas.status = 1;
									e.type = self.deviceType+'over';
									if(self.regEvent[inEvent].status){
										self.occur(thisAreas['onover'],e,thisAreas)
									}
								}else{
									inEvent = 'move';
									if(self.regEvent[inEvent].status){
										self.occur(thisAreas['onmove'],e,thisAreas)
									}
								}
							}else{
								if(thisAreas.status==1){
									inEvent = 'out';
									thisAreas.status = -1;
									e.type = self.deviceType+'out';
									if(self.regEvent[inEvent].status){
										self.occur(thisAreas['onout'],e,thisAreas)
									}
								}
							}
						}
					}
					
				}else{
					self.canvas['on'+self.regEvent[inEvent].name] = function(e){
						//获取当前鼠标在画布上的坐标
						var offset = self.getEventOffset(e);
						//遍历所有事件区域
						for(var i=0;i<self.childLength;i++){
							var thisAreas = self.areas[i];
							//鼠标是否在形状内
							var isIn = thisAreas.isInArea(offset.x,offset.y);
							if(isIn){
								var type = e.type.replace(/mouse|touch/g, "");
								//画布是否有注册当前事件
								if(self.regEvent[inEvent].status){
									self.occur(thisAreas['on'+inEvent],e,thisAreas)
								}
							}
						}
					}
				}
			}
		},
		//禁用
		disabled:function(){
			var len = arguments.length,
				self = this;
			
			for(var i=0;i<len;i++){
				var inEvent = arguments[i];
				if(!self.regEvent[inEvent].status)continue;
				
				self.regEvent[inEvent].status = false;
				
				if(inEvent=='move'||inEvent=='out'||inEvent=='over'){
					if(!self.regEvent['move'].status&&!self.regEvent['out'].status&&!self.regEvent['over'].status){
						self.canvas['on'+self.deviceType+'move'] = null;
					}
				}else{
					self.canvas['on'+self.regEvent[inEvent].name] = null;
				}
			}
		},
		
		addChild: function(){
			var len = arguments.length;
			for(var i=0;i<len;i++){
				this.areas.push(arguments[i])
			}
			this.childLength = this.areas.length;
		},
		
		removeChild:function(){
			var areas = this.areas,
				len = arguments.length;
				
			for(var i=0;i<len;i++){
				var index = this.getChildIndex(arguments[i]);
				if(index!=-1)this.areas.splice(index,1);
			}
			this.childLength = this.areas.length;
		},
		getChildIndex : function(child){
			var areas = this.areas,
				len = areas.length;
			for (var i = 0; i < len; i++) {
				if (child === areas[i]) {
					return i;
				}
			}
			return -1;	
		},
		getEventOffset:function(e){
			var offset = {x:0,y:0},
				self = this;
			if(e.type.indexOf('touch')!=-1){
				var canPosition = self.canvas.getBoundingClientRect();
				if(e.touches.length>0){
					offset.x = e.touches[0].clientX - canPosition.left - self.borderLeftWidth;
					offset.y = e.touches[0].clientY - canPosition.top - self.borderTopWidth;
				}else{
					offset.x = e.changedTouches[0].clientX - canPosition.left - self.borderLeftWidth;
					offset.y = e.changedTouches[0].clientY - canPosition.top - self.borderTopWidth;
				}
			}else{
				offset.x = e.offsetX||event.layerX;
				offset.y = e.offsetY||event.layerY;
			}
			return offset
		},
		
		occur: function(func, e, thisAreas){
			if(func && typeof func == "function"){
				func.call(thisAreas, e);
			}
		}
	}
	
	//新建一个区域
	CE.Area = function(shape){
		this.status = -1;
		this.shape = shape||null;
	}

	CE.Area.prototype = {
		constructor: CE.Area,
		addEvent:function(type, func){
			this['on'+type] = func;
		},
		removeEvent:function(type){
			this['on'+type] = null;
		},
		isInArea : function (pageX,pageY){
			return this.shape.isInside(pageX,pageY);
		}
	}
	
	//////////////
	CE.shape = {};
	CE.shape.Rect = function(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
 	CE.shape.Rect.prototype = {
		constructor: CE.shape.Rect,
		isInside:function(pageX,pageY){
			if(pageX>=this.x && pageX<= (this.x+this.width) && pageY >= this.y && pageY<=(this.y+this.height)){
				return true;
			}else{
				return false;
			}
		}
	}
	CE.shape.Arc = function(x,y,radius,startAngle,endAngle){
		
		var startD = startAngle<0?1:-1;
		var endD = endAngle<0?1:-1;
		
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.startAngle = startAngle+(Math.floor(Math.abs(startAngle)/360))*360*startD;
		this.endAngle = endAngle+(Math.ceil(Math.abs(endAngle)/360))*360*endD;
		
	}
 	CE.shape.Arc.prototype = {
		constructor: CE.shape.Arc,
		isInside:function(pageX,pageY){
			var dx = this.x - pageX;
			var dy = this.y - pageY;
			if(dx * dx + dy * dy > this.radius * this.radius)return false;
			var thisA = 180/Math.PI*Math.atan(dy/dx);

			if(pageX>=this.x&&pageY<=this.y){//第一象限
				thisA = 360+thisA
			}else if(pageX<=this.x&&pageY<=this.y){//第二象限
				thisA = 180+thisA
			}else if(pageX<=this.x&&pageY>=this.y){//第三象限
				thisA = 180+thisA
			}else if(pageX>=this.x&&pageY>=this.y){//第四象限
				thisA = thisA
			}
			
			if(thisA>=this.startAngle&&thisA<=this.endAngle){
				return true
			}else{
				return false
			}
		}
	}
	
	CE.shape.Polygon = function(points){
		this.points = points;
	}
 	CE.shape.Polygon.prototype = {
		constructor: CE.shape.Polygon,
		isInside:function(pageX,pageY){
			var B = false,
				points = this.points,
				len = points.length;
				
			for (var i = 0, j = len - 1; i < len; j = i++) {
				var xi = points[i].x, yi = points[i].y;
				var xj = points[j].x, yj = points[j].y;
				
				var intersect = ((yi > pageY) != (yj > pageY))
					&& (pageX < (xj - xi) * (pageY - yi) / (yj - yi) + xi);
					//console.log(pageX,pageY)
				if (intersect){
					B = !B;
				}
			}
			return B; 
		}
	}
		
	
	

})(window);