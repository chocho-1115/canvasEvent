
(function(window){
	
	window.canvasEvent = window.CE = {};
	CE.Stage = function(canvas,regEvent){
		
		var self = this;
			
		if(canvas.currentStyle){
			this.borderLeftWidth = parseFloat(canvas.currentStyle['borderLeftWidth']);
			this.borderTopWidth = parseFloat(canvas.currentStyle['borderTopWidth']);
		}else{
			this.borderLeftWidth = parseFloat(getComputedStyle(canvas, null)['borderLeftWidth']);
			this.borderTopWidth = parseFloat(getComputedStyle(canvas, null)['borderTopWidth']);
		}
		
		this.canvas = canvas;
		this.areas = [];
		this.childLength = 0;
		this.regEvent = {
			down : false,
			up : false,
			click : false,
			over : false,
			out : false,
			move : false
		};
		
		
		
		
		self.enabled.apply(this,regEvent);
	
	}
	
	CE.Stage.prototype = {
		constructor: CE.Stage,
		//启用
		enabled:function(){
			var len = arguments.length,
				self = this,
				deviceType =  'ontouchstart' in document ? 'touch' : 'mouse';

			for(var i=0;i<len;i++){
				var inEvent = '',
					addEvent = '';
				addEvent = inEvent = arguments[i];
				
				self.regEvent[inEvent] = true;
				//防止重复启用move事件
				switch(inEvent){
					
					case 'click':
						if(self.canvas['onclick']){
							continue;
						}
						addEvent = 'click';
						break;
					case 'down':
						if(deviceType=='touch')inEvent = 'start'
						if(self.canvas['on'+deviceType+inEvent]){
							continue;
						}
						addEvent = deviceType+inEvent;
						break;
					case 'up':
						if(deviceType=='touch')inEvent = 'end'
						if(self.canvas['on'+deviceType+inEvent]){
							continue;
						}
						addEvent = deviceType+inEvent;
						break;
					default :
						if (inEvent=='over'||inEvent=='move'||inEvent=='out'){
							if(self.canvas['on'+deviceType+'move']){
								continue;
							}
							addEvent = deviceType+'move';
						}else{
							continue;
						}
					
				}
				
				
				
				if(addEvent==deviceType+'move'){
					
					//text.innerHTML += 'ADD ' + addEvent + '|'
					
					self.canvas['on'+addEvent] = function(e){
						var offset = self.getEventOffset(e);
						for(var i=0;i<self.childLength;i++){
							var isIn = self.areas[i].isInArea(offset.x,offset.y);
							if(isIn){
								if(self.areas[i].status==-1){
									self.areas[i].status = 1;
									e.type = deviceType+'over';
									self.occur(self.areas[i]['onover'],e)
								}else{
									self.occur(self.areas[i]['onmove'],e)
								}
							}else{
								if(self.areas[i].status==1){
									self.areas[i].status = -1;
									e.type = deviceType+'out';
									self.occur(self.areas[i]['onout'],e)
								}
							}
						}
					}
					
				}else{
					//text.innerHTML += 'ADD ' + addEvent + '|'
					self.canvas['on'+addEvent] = function(e){
						var offset = self.getEventOffset(e);
						for(var i=0;i<self.childLength;i++){
							var isIn = self.areas[i].isInArea(offset.x,offset.y);
							
							
							
							if(isIn){
								var type = e.type.replace(/mouse|touch/g, "");
								
								if(type=='start'){
									self.occur(self.areas[i]['on'+'down'],e)
								}else if(type=='end'){
									self.occur(self.areas[i]['on'+'up'],e)
								}else{
									self.occur(self.areas[i]['on'+type],e)
								}
								
							}
						}
					}
					

				}
			}
			
			
			
			
		},
		//禁用
		disabled:function(){
			var len = arguments.length;
			var self = this;
			
			for(var i=0;i<len;i++){
				self.canvas['on'+arguments[i]] = null;
				self.regEvent[arguments[i]] = false;
			}
		},
		
		addChild: function(child){
			this.areas.push(child)
			this.childLength = this.areas.length;
		},
		removeChild:function(child){
			
			for(var i = child.index;i<this.areas.length;i++){
				this.areas[i].index--;
			}
			
			this.areas.splice(child.index,1);
			
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
				//text.innerHTML += 10 + '|';
			}else{
				offset.x = e.offsetX||event.layerX;
				offset.y = e.offsetY||event.layerY;
			}
			
				
			return offset
		},
		
		occur: function(func, e){
			if(func && typeof func == "function"){
				func(e);
			}
		}
	}
	
	//新建一个区域
	CE.Area = function(s,type,option){
		this.stage = s;
		this.index = s.areas.length;
		this.type = type||'';
		this.x = option.x;
		this.y = option.y;
		this.status = -1;
		s.addChild(this);
		
		if(this.type='rect'){
			this.width = option.width;
			this.height = option.height;
		}
	}
	
	CE.Area.prototype = {
		constructor: CE.Area,
		addEvent:function(type, func){
			this['on'+type] = func;
		},
		removeEvent:function(type){
			this['on'+type] = null;
		},
		isInArea:function(pageX,pageY){
			
			var x = this.x;
			var y = this.y;

			switch(this.type){
				case 'rect':
					if(pageX>=x && pageX<= (x+this.width) && pageY >= y && pageY<=(y+this.height)){
						return true;
					}
					
				case 'round':
					return false
			}
			return false;
		}
		
		
		
	}
	
	
	
	
	
	
	
	
	

})(window);