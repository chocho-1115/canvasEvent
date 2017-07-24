
(function(window){
	
	window.canvasEvent = window.CE = {};
	CE.Stage = function(canvas,regEvent){
		
		var self = this;
		for(var i=0;i<regEvent.length;i++){
			canvas.addEventListener(regEvent[i], function(e){
			
				var offsetX = e.offsetX||event.layerX;
				var offsetY = e.offsetY||event.layerY;
				
				for(var i=0;i<self.childLength;i++){
					if(self.areas[i].isInArea(offsetX,offsetY)){
						self.occur(self.areas[i]['on'+e.type],e)
					}
				}
				
			},false);
		}
		
		
		this.canvas = canvas;
		this.areas = [];
		this.childLength = 0;
	
	}
	
	CE.Stage.prototype = {
		constructor: CE.Stage,
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