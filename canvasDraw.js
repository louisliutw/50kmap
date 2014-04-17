(function() {
  var paint = {
    init: function() {
      this.load();
    },
    load: function() {
      this.x = []; //记录鼠标移动是的X坐标
      this.y = []; //记录鼠标移动是的Y坐标
      this.clickDrag = [];
      this.lock = false; //鼠标移动前，判断鼠标是否按下
      this.isEraser = false;
      //this.Timer=null;//橡皮擦启动计时器
      //this.radius=5;
      this.storageColor = "#000000";
      this.eraserRadius = 15; //擦除半径值
      this.color = ["#000000", "#FA0300"]; //画笔颜色值
      this.colorID = 0;
      this.fontWeight = [2, 5, 8];
      this.$ = function(id) {
        return typeof id == "string" ? document.getElementById(id) : id;
      };
      this.canvas = this.$("myCanvas");
      this.canvas.width = window.innerWidth * 0.98;
      this.canvas.height = window.innerHeight * 0.9;
      // this.$('canvas1').width = window.innerWidth * 0.98;
      // this.$('canvas1').height = window.innerHeight * 0.9;
      // console.log($("#canvas").position().left);
      // console.log($("#canvas").position().top);
      // $("#canvas1").position().left=($("#canvas").position().left);
      // $("#canvas1").position().top=($("#canvas").position().top);
      if (this.canvas.getContext) {} else {
        alert("Your browser can't support canvas tag.");
        return;
      }
      this.cxt = this.canvas.getContext('2d');
      this.cxt.lineJoin = "round"; //context.lineJoin - 指定两条线段的连接方式
      this.cxt.lineWidth = 5; //线条的宽度
      // this.iptClear = this.$("clear");
      this.imgurl = this.$("imgurl"); //图片路径按钮
      this.w = this.canvas.width; //取画布的宽
      this.h = this.canvas.height; //取画布的高
      this.touch = ("createTouch" in document); //判定是否为手持设备
      this.StartEvent = this.touch ? "touchstart" : "mousedown"; //支持触摸式使用相应的事件替代
      this.MoveEvent = this.touch ? "touchmove" : "mousemove";
      this.EndEvent = this.touch ? "touchend" : "mouseup";
      this.bind();
    },
    bind: function() {
      var t = this;
      /*清除画布*/
      // this.iptClear.onclick = function() {
      //   t.clear();
      // };
      /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
      this.canvas['on' + t.StartEvent] = function(e) {
        var touch = t.touch ? e.touches[0] : e;
        var _x = touch.clientX - touch.target.offsetLeft; //鼠标在画布上的x坐标，以画布左上角为起点
        var _y = touch.clientY - touch.target.offsetTop; //鼠标在画布上的y坐标，以画布左上角为起点
        if (t.isEraser) {
          /*
  t.cxt.globalCompositeOperation = "destination-out";
  t.cxt.beginPath();
  t.cxt.arc(_x, _y,t.eraserRadius, 0, Math.PI * 2);
  t.cxt.strokeStyle = "rgba(250,250,250,0)";
  t.cxt.fill();
  t.cxt.globalCompositeOperation = "source-over";
  */
          t.resetEraser(_x, _y, touch);
        } else {
          t.movePoint(_x, _y); //记录鼠标位置
          t.drawPoint(); //绘制路线
        }
        t.lock = true;
      };
      /*鼠标移动事件*/
      this.canvas['on' + t.MoveEvent] = function(e) {
        var touch = t.touch ? e.touches[0] : e;
        if (t.lock) //t.lock为true则执行
        {
          var _x = touch.clientX - touch.target.offsetLeft; //鼠标在画布上的x坐标，以画布左上角为起点
          var _y = touch.clientY - touch.target.offsetTop; //鼠标在画布上的y坐标，以画布左上角为起点
          if (t.isEraser) {
            //if(t.Timer)clearInterval(t.Timer);
            //t.Timer=setInterval(function(){
            t.resetEraser(_x, _y, touch);
            //},10);
          } else {
            t.movePoint(_x, _y, true); //记录鼠标位置
            t.drawPoint(); //绘制路线
          }
        }
      };
      this.canvas['on' + t.EndEvent] = function(e) {
        /*重置数据*/
        t.lock = false;
        t.x = [];
        t.y = [];
        t.clickDrag = [];
        // clearInterval(t.Timer);
        // t.Timer = null;
      };
      // this.changeColor();
      this.imgurl.onclick = function() {
        t.getUrl();
      };
      /*Draw*/
      this.$('draw').onclick = function(e) {
        t.isEraser = false;
        t.cxt.strokeStyle = t.color[t.colorID];
      }
      /*橡皮擦*/
      this.$("eraser").onclick = function(e) {
        t.isEraser = true;
      };
      this.$('changeColor').onclick = function(e){
        t.colorID = (t.colorID+1)%2;
        t.cxt.strokeStyle = t.color[t.colorID];
      };
      // this.$('markButton').onclick = function(e){
      //   $('#mark').val('');
      //   $('#mark').css('display', 'block');
      //   $('#setMark').css('display', 'block');
      // };
      // $('#setMark').click(function(e){
      //   $('#mark').css('display', 'none');
      //   $('#setMark').css('display', 'none');
      //   // $("<img />", { src: paint.mapMark($('#mark').val(), {
      //   //         //注意: fontName所指定字型，需使用者機器上有安裝才算數
      //   //         fontName: "微軟正黑體", fontSize: 14, fontStyle: "bold",
      //   //         padding: 5, bgColor: "red", fgColor: "white"
      //   //     }) }).appendTo("body");
      // });

    },
    movePoint: function(x, y, dragging) {
      /*将鼠标坐标添加到各自对应的数组里*/
      this.x.push(x);
      this.y.push(y);
      this.clickDrag.push(y);
    },
    drawPoint: function(x, y, radius) {
      for (var i = 0; i < this.x.length; i++) //循环数组
      {
        this.cxt.beginPath(); //context.beginPath() , 准备绘制一条路径
        if (this.clickDrag[i] && i) { //当是拖动而且i!=0时，从上一个点开始画线。
          this.cxt.moveTo(this.x[i - 1], this.y[i - 1]); //context.moveTo(x, y) , 新开一个路径，并指定路径的起点
        } else {
          this.cxt.moveTo(this.x[i] - 1, this.y[i]);
        }
        this.cxt.lineTo(this.x[i], this.y[i]); //context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
        this.cxt.closePath(); //context.closePath() , 如果当前路径是打开的则关闭它
        this.cxt.stroke(); //context.stroke() , 绘制当前路径
      }
    },
    clear: function() {
      this.cxt.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点
    },
    preventDefault: function(e) {
      /*阻止默认*/
      var touch = this.touch ? e.touches[0] : e;
      if (this.touch) touch.preventDefault();
      else window.event.returnValue = false;
    },
    changeColor: function() {
      /*为按钮添加事件*/
      var t = this,
        iptNum = this.$("color").getElementsByTagName("input"),
        fontIptNum = this.$("font").getElementsByTagName("input");
      for (var i = 0, l = iptNum.length; i < l; i++) {
        iptNum[i].index = i;
        iptNum[i].onclick = function() {
          t.cxt.save();
          t.cxt.strokeStyle = t.color[this.index];
          t.storageColor = t.color[this.index];
          t.cxt.strokeStyle = t.storageColor;
          t.isEraser = false;
        }
      }
      for (var i = 0, l = fontIptNum.length; i < l; i++) {
        t.cxt.save();
        fontIptNum[i].index = i;
        fontIptNum[i].onclick = function() {
          t.changeBackground(this.index);
          t.cxt.lineWidth = t.fontWeight[this.index];
          t.isEraser = false;
          t.cxt.strokeStyle = t.storageColor;
        }
      }
    },
    changeBackground: function(num) {
      /*添加画笔粗细的提示背景颜色切换，灰色为当前*/
      var fontIptNum = this.$("font").getElementsByTagName("input");
      for (var j = 0, m = fontIptNum.length; j < m; j++) {
        fontIptNum[j].className = "";
        if (j == num) fontIptNum[j].className = "grea";
      }
    },
    getUrl: function() {
      // this.$("html").innerHTML = this.canvas.toDataURL();
      // window.open(this.canvas.toDataURL());
      this.$('download').href = this.canvas.toDataURL();
      this.$('download').style.display = "";
    },
    resetEraser: function(_x, _y, touch) {
      /*使用橡皮擦-提醒*/
      var t = this;
      //this.cxt.lineWidth = 30;
      /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
      t.cxt.globalCompositeOperation = "destination-out";
      t.cxt.beginPath();
      t.cxt.arc(_x, _y, t.eraserRadius, 0, Math.PI * 2);
      t.cxt.strokeStyle = "rgba(250,250,250,0)";
      t.cxt.fill();
      t.cxt.globalCompositeOperation = "source-over"
    },
    mapMark: function(text, opt) {
      //定義預設參數
      var defaultOptions = {
        fontStyle: "normal", //normal, bold, italic
        fontName: "Arial",
        fontSize: 12, //以Pixel為單位
        bgColor: "darkblue",
        fgColor: "white",
        padding: 4,
        arrowHeight: 6 //下方尖角高度
      };
      options = $.extend(defaultOptions, opt);
      //建立Canvas，開始幹活兒
      var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
      //評估文字尺寸
      var font = options.fontStyle + " " + options.fontSize + "px " +
        options.fontName;
      context.font = font;
      var metrics = context.measureText(text);
      //文字大小加上padding作為外部尺寸
      var w = metrics.width + options.padding * 2;
      //高度以Font的大小為準
      var h = options.fontSize + options.padding * 2 +
        options.arrowHeight;
      canvas.width = w;
      canvas.height = h;
      //邊框及背景
      context.beginPath();
      context.rect(0, 0, w, h - options.arrowHeight);
      context.fillStyle = options.bgColor;
      context.fill();
      //畫出下方尖角
      context.beginPath();
      var x = w / 2,
        y = h,
        arwSz = options.arrowHeight;
      context.moveTo(x, y);
      context.lineTo(x - arwSz, y - arwSz);
      context.lineTo(x + arwSz, y - arwSz);
      context.lineTo(x, y);
      context.fill();
      //印出文字
      context.textAlign = "center";
      context.fillStyle = options.fgColor;
      context.font = font;
      context.fillText(text,
        w / 2, (h - options.arrowHeight) / 2 + options.padding);
      //傳回DataURI字串
      return canvas.toDataURL();
    }
  };
  paint.init();
  // init2();
})();