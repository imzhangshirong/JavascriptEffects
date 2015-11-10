/**
 * Created by Jarvis on 2015/10/15, Update 2015/11/8
 */
var size=[window.screen.availWidth,window.screen.availHeight];//[width,height]
var pointSize=[parseInt(size[1]/120),parseInt(size[0]/150)];//[rows,cols]
var MaxR=70;//点移动最大半径
var Maxr=0.05;//最大移动速度
var MaxOpacity=0.5;//最大透明度
var MaxOpacityV=0.02;//最大透明度变化
var time=30;//刷新时间
var canvasE=document.getElementById('lower');//指定的id
canvasE.style.marginLeft=-size[0]/2+'px';
canvasE.style.marginTop=-size[1]/2+'px';
var canvas = canvasE.getContext('2d');
var bufferCanvasE = document.createElement('canvas');
var bufferCanvas = bufferCanvasE.getContext('2d');
canvasE.width=size[0];
canvasE.height=size[1];
bufferCanvasE.width=size[0];
bufferCanvasE.height=size[1];
var points=new Array()
for(var a=0;a<=pointSize[0];a++){
	var line=new Array();
	for(var b=0;b<=pointSize[1];b++){
		var temp={'R':Math.random()*MaxR,'r':0.1+Math.random()*Maxr}
		var temp_=Math.random()*360;
		temp['vector']=[temp['r']*Math.cos(temp_),temp['r']*Math.sin(temp_)];
		var temp_=Math.random()*360;
		temp['position']=[temp['R']*Math.cos(temp_),temp['R']*Math.sin(temp_)];
		temp['oldvector']=[0,0];
		line[line.length]=temp;
	}
	points[points.length]=line.concat();
}
var blocks1=new Array();
var blocks2=new Array()
for(var a=0;a<pointSize[0];a++){
	var line=new Array();
	for(var b=0;b<pointSize[1];b++){
		var temp={'opacity':Math.random()*MaxOpacity}
		temp['vector']=(Math.random()*2-1)*MaxOpacityV;
		temp['oldvector']=0;
		//temp['points']=new Array();
		//temp['points'][0]=[parseInt(a/2),parseInt(b/2)];
		line[line.length]=temp;
	}
	blocks1[blocks1.length]=line.concat();
	var line=new Array();
	for(var b=0;b<pointSize[1];b++){
		var temp={'opacity':Math.random()*MaxOpacity}
		temp['vector']=(Math.random()*2-1)*MaxOpacityV;
		temp['oldvector']=0;
		//temp['points']=new Array();
		//temp['points'][0]=[parseInt(a/2),parseInt(b/2)];
		line[line.length]=temp;
	}
	blocks2[blocks2.length]=line.concat();
}
//console.log(points);
//console.log(blocks1);
setInterval(function(){
	drawn();
},time)
function drawn(){
	bufferCanvas.clearRect(0,0,size[0],size[1]);
	var d=[size[1]/pointSize[0],size[0]/pointSize[1]];
	var m=new Array();
	m[0]=[1,-1];
	m[1]=[-1,1];
	m[2]=[-1,-1];
	for(var a=0;a<=pointSize[0];a++) {
		for (var b=0;b<=pointSize[1];b++) {
			points[a][b]['position'][0]+=points[a][b]['vector'][0];
			points[a][b]['position'][1]+=points[a][b]['vector'][1];
			if(Math.pow(points[a][b]['position'][0],2)+Math.pow(points[a][b]['position'][1],2)>Math.pow(points[a][b]['R'],2)){
				points[a][b]['position'][0]-=points[a][b]['vector'][0];
				points[a][b]['position'][1]-=points[a][b]['vector'][1];
				var temp=parseInt(Math.random()*3);
				points[a][b]['vector'][0]=-points[a][b]['vector'][0];
				points[a][b]['vector'][1]=-points[a][b]['vector'][1];
				var temp_=Math.random()*360;
				points[a][b]['vector']=[points[a][b]['r']*Math.cos(temp_),points[a][b]['r']*Math.sin(temp_)];
				points[a][b]['R']+=(Math.random()*2-1)*2;
			}
		}
	}
	for(var a=0;a<pointSize[0];a++){
		for(var b=0;b<pointSize[1];b++){
			blocks1[a][b]['opacity']+=blocks1[a][b]['vector'];
			if(blocks1[a][b]['opacity']>MaxOpacity || blocks1[a][b]['opacity']<0){
				blocks1[a][b]['opacity']-=blocks1[a][b]['vector'];
				blocks1[a][b]['vector']=(Math.random()*2-1)*MaxOpacityV;
			}
			blocks2[a][b]['opacity']+=blocks2[a][b]['vector'];
			if(blocks2[a][b]['opacity']>MaxOpacity || blocks2[a][b]['opacity']<0){
				blocks2[a][b]['opacity']-=blocks2[a][b]['vector'];
				blocks2[a][b]['vector']=(Math.random()*2-1)*MaxOpacityV;
			}
		}
	}
	for(var a=0;a<pointSize[0];a++){
		for(var b=0;b<pointSize[1];b++){
			var point1=[d[1]*b+points[a][b]['position'][0],d[0]*a+points[a][b]['position'][1]];
			var point2=[d[1]*b+points[a+1][b]['position'][0],d[0]*(a+1)+points[a+1][b]['position'][1]];
			var point3=[d[1]*(b+1)+points[a][b+1]['position'][0],d[0]*a+points[a][b+1]['position'][1]];
			//var point=[d[0]*b,d[1]*a];
			bufferCanvas.beginPath();
			bufferCanvas.moveTo(point1[0], point1[1]);
			bufferCanvas.lineTo(point2[0], point2[1]);
			bufferCanvas.lineTo(point3[0], point3[1]);
			bufferCanvas.lineTo(point1[0], point1[1]);
			bufferCanvas.fillStyle="rgba(0,0,0,"+blocks1[a][b]['opacity']+")";
			bufferCanvas.fill();
			bufferCanvas.closePath();
		}

	}
	for(var a=0;a<pointSize[0];a++){
		for(var b=0;b<pointSize[1];b++){
			var point1=[d[1]*b+points[a+1][b]['position'][0],d[0]*(a+1)+points[a+1][b]['position'][1]];
			var point2=[d[1]*(b+1)+points[a+1][b+1]['position'][0],d[0]*(a+1)+points[a+1][b+1]['position'][1]];
			var point3=[d[1]*(b+1)+points[a][b+1]['position'][0],d[0]*a+points[a][b+1]['position'][1]];
			//var point=[d[0]*b,d[1]*a];
			bufferCanvas.beginPath();
			bufferCanvas.moveTo(point1[0], point1[1]);
			bufferCanvas.lineTo(point2[0], point2[1]);
			bufferCanvas.lineTo(point3[0], point3[1]);
			bufferCanvas.lineTo(point1[0], point1[1]);
			bufferCanvas.fillStyle="rgba(0,0,0,"+blocks2[a][b]['opacity']+")";
			bufferCanvas.fill();
			bufferCanvas.closePath();
		}

	}
	canvas.clearRect(0,0,size[0],size[1]);
	canvas.drawImage(bufferCanvasE, 0, 0);
}