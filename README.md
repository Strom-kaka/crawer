# crawer
简单的node 爬虫网页数据

＃＃＃由来
前面看了 Ustbhuangyi老师的  Vue.js高仿饿了么外卖App；
无意中听他说是从饿了么网站上爬取的数据用来做教程；
我便来了兴趣，我想知道爬取数据的经过是怎么来的；
于是我便研究了下node.js的部分功能，然后用美团外卖网站来做了个实验；
最终我还是弄出来了（嘿嘿）

``` bash
＃＃＃
思路也很简单
1.通过http服务获取简单的html内容，获取到的和在浏览器 右键－查看网页源代码 所见到的一模一样
2.可以通过node.js 的cheerio 模块儿来分析1步骤得到的html
3.可以通过正则表达式来过滤所需要的数据内容（去掉空格、回车，截取2个字符）
4.可以凭自己喜好添加更多的熟悉（类型），为不要全部都使用一样数据，可以用到js来随机数组，随机数字
5.可以通过node。js 的fs 模块儿来创建json文件来保存所获得的json数据
6.格式化json文件中的内容，大功告成

＃sercer.js
  简单http服务,用于测试所用方法是否正确

＃meituan.js
  用于爬取单一页面的数据，并获取一些基本信息来初步包装data数据


＃＃＃＃＃＃
crawer.js
	最终的完成品
	1.同时获取美团外卖首页20家商家的基本信息
	2.同时获取美团外卖20家商家的所有商品信息
	3.给20家商家动态添加其他信息（商家类型、商家优惠活动）
	4.在文件夹data下生成data.json文件

``` bash

cd crawer

# install dependencies
npm install

# start serve
node crawer.js
