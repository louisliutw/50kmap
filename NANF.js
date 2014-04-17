var ctx;
var i,count=0,count_bubble=0;
var x = 50,move_x=0;
var y = 350;
var radius = 15;
var time = 0;
var kebord_count=0;
function init(){
	alert("function");	
}

function doKeyDown(e) {
	//console.log("doKeyDown");
	//console.log(document.getElementById("test").background);
	if((kebord_count%3)==0)
		document.getElementById("test").background="pic/ocean.jpg";
	else if((kebord_count%3)==1)
		document.getElementById("test").background="pic/ocean2.jpg";
	else
		document.getElementById("test").background="pic/ocean3.jpg";
	//console.log(document.getElementById("test").background);
	kebord_count++;
	
}
function mousedownandler(e) {
    console.log(myCanvas.width,myCanvas.height);
	//ctx.translate(0, 50); 
	//ctx.clearRect(-400, -250, 800, 500);
	//ctx.clearRect(-300, -150, 800, 500);
    var x = e.clientX;
    var y = e.clientY;
	var x = e.pageX - myCanvas.offsetLeft;
    var y = e.pageY - myCanvas.offsetTop;
	console.log(x,y);
	//x=x*300/800;
	//y=y*150/500;
	//ctx.fillStyle="#63B8FF";
	ctx.strokeStyle="#00FFFF";
	ctx.globalAlpha = 0.3;
	var dis=2;
	for(var i=0;i<5;i++){
		ctx.moveTo(x-(i*dis),y);
		ctx.bezierCurveTo(x-(i*dis),y-5-(i*dis),x+10+(i*dis),y-5-(i*dis),x+10+(i*dis),y);
		ctx.bezierCurveTo(x+10+(i*dis),y+5+(i*dis),x-(i*dis),y+5+(i*dis),x-(i*dis),y);
		ctx.stroke();
    }
}
function mousemoveandler(e) {
   //console.log("mousemoveandler",x,y);        
}
function mouseupHandler(e) {
   //console.log("mouseupHandler");
   //ctx.translate(0, -50); 
}
function PaintBack(img){
	//alert("PaintBack");
	var c=document.getElementById("myCanvas");
    ctx = c.getContext("2d");
	//ctx.drawImage(img,0,0);
}
function PaintStar(){
console.log("PaintStar");        
	ctx.strokeStyle="#000000";
	ctx.globalAlpha = 0.5;
	ctx.beginPath();
	ctx.fillStyle="#6E8B3D";
	ctx.moveTo(200,100);
	ctx.bezierCurveTo(180,80,240,80,220,100);
	ctx.lineTo(200,100);
	ctx.moveTo(206,100);
	ctx.bezierCurveTo(200,110,204,120,206,140);
	ctx.moveTo(212,100);
	//ctx.bezierCurveTo(200,110,204,120,206,140);
	ctx.stroke();
}
function PaintBubble(){
	//console.log("PaintBubble");
	//ctx.clearRect(0, 0, myCanvas.width,myCanvas.height);
	for( i=0 ;i<8;i++){
		ctx.globalAlpha = 0.5;
		ctx.beginPath();
		ctx.arc(x+(i*100),y, radius, 0, Math.PI * 2, true);
		ctx.closePath();
	
		var color = ctx.createRadialGradient(x,y,0,x+2,y+2,radius);
		color.addColorStop(0,"#4682B4");
		color.addColorStop(1,"#87CEFF");
		ctx.fillStyle=color;		
		ctx.fill();
	}
	if((count_bubble%2)==0)
		x+=15;
	else
		x-=15;
	count_bubble++;
	y -= 10;
	radius+=0.3;
	if (y < 0) {
		x = 50;
		y = 350;
		radius=15;
	}          
     ctx.restore();  
}

function CanelTimer(timer){
    if(timer)
		time = timer;
    //console.log("CanelTimer",count,timer);
	if(count == 39){
		//console.log("CanelTimer");
		count_bubble = 0;
		radius = 15;
	}
	if(count == 30){
		clearInterval(time);
	}
}

function Move(){
	PaintFish();

	count++;
	if(count > 20){
		move_x++;
		if(count ==40){
		    ctx.translate(150, 0);
			ctx.scale(-1, 1);
			count=0;
		}
	}else{
		move_x--;
		if(count==10){
			ctx.translate(30, 0);
			ctx.scale(-1, 1);
		}
	}
	
	ctx.translate(move_x, 0); 
    //ctx.save();	
	ctx.restore();  
	//console.log(move_x,count);		
	PaintBubble();

}

function PaintFish(){
	ctx.clearRect(0, 0, myCanvas.width,myCanvas.height);
	//身體
	ctx.strokeStyle="#000000";
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.fillStyle="#6E8B3D";
	ctx.moveTo(20,20);
	ctx.bezierCurveTo(20,50,100,50,100,20);
	ctx.bezierCurveTo(100,0,20,0,20,20);
	ctx.fill();
	ctx.stroke();
	
	//尾吧
	ctx.beginPath();
	ctx.fillStyle="#6E8B3D";
	ctx.moveTo(120,20);
	ctx.arc(110,20,10,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	
	//斑
	ctx.fillStyle="#000000";
	
	for(var j =0;j<5;j++){
		for(var k=0;k<2;k++){
			ctx.beginPath();
			ctx.arc(52+(j*10),18+(k*10),3,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
	}
	
	//嘴吧
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(35,35,5,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.moveTo(33,33);
	ctx.fillStyle="#ffffff";
	ctx.bezierCurveTo(33,36,38,36,38,33);
	ctx.stroke();
	
	//眼睛
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(25,15,8,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle="#000000";
	ctx.beginPath();
	ctx.arc(25,15,3,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(25,15,1,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill(); //left
	
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(40,15,8,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle="#000000";
	ctx.beginPath();
	ctx.arc(40,15,3,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(40,15,1,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill(); //right
}
