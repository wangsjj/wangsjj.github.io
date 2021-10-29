# coding:utf-8
import os
import webbrowser
from faker import Faker

fake = Faker(locale="zh_CN")
xingming = (fake.name())  # 姓名
dizhi = (fake.address())  # 地址
shoujihao = (fake.phone_number())  # 手机号
shenfenzheng = (fake.ssn())  # 身份证号
import random
import re


def car_num():
    char0 = ["京", "津", "沪", "渝", "冀", "豫", "云", "辽", "黑", "湘", "皖", "鲁", "新", "苏", "浙", "赣", "鄂", "桂", "甘", "晋", "蒙",
             "陕", "吉", "闽", "赣", "粤", "青", "藏", "川", "宁", "琼"]  # 省份简称
    char1 = 'ABCDEFGHJKLMNPQRSTUVWXYZ'  # 车牌号中没有I和O
    char2 = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'

    id_1 = random.choice(char0)  # 车牌号第一位     省份简称
    id_2 = ''.join(random.sample(char1, 1))  # 车牌号第二位

    while True:
        id_3 = ''.join(random.sample(char2, 5))
        v = id_3.isalpha()  # 所有字符都是字母时返回 true
        if v == True:
            continue
        else:
            car_id = id_1 + id_2 + id_3
            # print car_id
            break

    return car_id


chepaihao = (car_num())  # 随机产生车牌号
# chepaihao=(fake.license_plate())# 随机产生车牌号
import random
import string

string_length = 17
letters_digits = string.ascii_uppercase + string.digits
chejiahao = (''.join(random.choice(letters_digits) for i in range(string_length)))
# input("输入任意键结束")

# 命名生成的html
GEN_HTML = "测试数据.html"
# 打开文件，准备写入
f = open(GEN_HTML, 'w')

# 准备相关变量
str1 = 'xingming :'
str2 = 'dizhi'
str2 = 'shoujihao'
str2 = 'shenfenzheng'
str2 = 'chepaihao'
str2 = 'chejiahao'

# 写入HTML界面中
message = """
<html>
<body background="https://sun-mall-stage.oss-cn-shanghai.aliyuncs.com/1/material/45e5f0dc-c0aa-4e86-a968-a6697de6c820.jpg">
<table border="1">
    <tr>
        <th>姓名</th>
        <td>%s</td>
    </tr>
    <tr>
        <th>地址</th>
        <td>%s</td>
    </tr>
    <tr>
        <th>手机号</th>
        <td>%s</td>
    </tr>
    <tr>
        <th>身份证号</th>
        <td>%s</td>
    </tr>
    <tr>
        <th>车牌号</th>
        <td>%s</td>
    </tr>
    <tr>
        <th>车架号</th>
        <td>%s</td>
    </tr>
</table>
</body>
<h1 style="text-align:left"></h1>
<head></head>
<body>
    <script src="js/jquery-2.2.0.min.js"></script>
    <script >
    var a_idx=0;
    jQuery(document).ready(function($){
      addTips = function(e){
        var a= new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善");
        var i=$("<span />").text(a[a_idx]);
        var x=e.pageX,y=e.pageY;
        i.css({
          "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
          "top":y-20,
          "left":x,
          "position":"absolute",
          "font-weight":"bold",
          "color":"#ff6651"
        });

        $("body").append(i);
        i.animate({"top": y-180,"opacity":0},1500,function(){i.remove()})
        return false;
      }
      //绑定鼠标左键
      $("body").click(addTips);
      //绑定鼠标左键
      $("body").bind("contextmenu",addTips)
  });
    </script>
    <script>
      function o(w,v,i){
          return w.getAttribute(v)||i
      }
      function j(i){
          return document.getElementsByTagName(i)
      }
      function l(){
          var i=j("script"),w=i.length,v=i[w-1];
          return {l:w,z:o(v,"zIndex",-1),o:o(v,"opacity",0.5),c:o(v,"color","0,0,0"),n:o(v,"count",99)}
      }
      function k(){
          r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,
          n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight
      }
      function b(){
          e.clearRect(0,0,r,n);
          var w=[f].concat(t);
          var x,v,A,B,z,y;
          t.forEach(function(i){
              i.x+=i.xa,
              i.y+=i.ya,
              i.xa*=i.x>r||i.x<0?-1:1,
              i.ya*=i.y>n||i.y<0?-1:1,
              e.fillRect(i.x-0.5,i.y-0.5,1,1);
              for(v=0;v<w.length;v++){
                  x=w[v];
                  if(i!==x&&null!==x.x&&null!==x.y){
                      B=i.x-x.x,z=i.y-x.y,y=B*B+z*z;
                      y<x.max&&(x===f&&y>=x.max/2&&(i.x-=0.03*B,i.y-=0.03*z),A=(x.max-y)/x.max,e.beginPath(),e.lineWidth=A/2,e.strokeStyle="rgba("+s.c+","+(A+0.2)+")",e.moveTo(i.x,i.y),e.lineTo(x.x,x.y),e.stroke())
                  }
              }
              w.splice(w.indexOf(i),1)
          }),m(b)
      }
      var u=document.createElement("canvas"),s=l(),c="c_n"+s.l,e=u.getContext("2d"),r,n,
      m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){
          window.setTimeout(i,1000/45)
      },
      a=Math.random,f={x:null,y:null,max:20000};
      u.className="particle_canvas";
      var browserName = navigator.userAgent.toLowerCase();
      if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
          u.className += ' ie10_gte';
      };
      u.id=c;
      u.style.cssText="position:fixed;top:0;left:0;z-index:"+s.z+";opacity:"+s.o;
      j("body")[0].appendChild(u);
      k(),window.onresize=k;
      window.onmousemove=function(i){
          i=i||window.event,
          f.x=i.clientX,
          f.y=i.clientY
      },
      window.onmouseout=function(){
          f.x=null,
          f.y=null
      };
      for(var t=[],p=0;s.n>p;p++){
          var h=a()*r,
          g=a()*n,
          q=2*a()-1,
          d=2*a()-1;
          t.push({x:h,y:g,xa:q,ya:d,max:6000})
      }
      setTimeout(function(){b()},100)
    </script>
    <style>
  .github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out
  }
  @media (max-width:500px) {
    .github-corner:hover .octo-arm {
      animation: none
    }
    .github-corner .octo-arm {
      animation: octocat-wave 560ms ease-in-out
    }
  }
</style>
<meta http-equiv="Content-Type" content="text/html; charset=gbk"/>
</body>
</html>
""" % (xingming, dizhi, shoujihao, shenfenzheng, chepaihao, chejiahao)

# 写入文件
f.write(message)
# 关闭文件
f.close()

# 运行完自动在网页中显示
webbrowser.open(GEN_HTML, new=1)
