var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('Promise');
var baseUrl = 'http://waimai.meituan.com/restaurant/';
var url = 'http://waimai.meituan.com/home/wwgnr2rsydpk';

var sellerIds = [];

var datas = [];


var supports = [     
	 {
        "type": 0,
        "description": "在线支付满28减5"
      },
      {
        "type": 1,
        "description": "部分商品8折"
      },
      {
        "type": 2,
        "description": "精彩套餐买不停"
      },
      {
        "type": 3,
        "description": "该商家支持发票,请下单写好发票抬头"
      },
      {
        "type": 4,
        "description": "已加入“外卖保”计划,食品安全保障"
      }];

function getRandomArrayElements(arr, count) {  //从数组中随机选取几个数字来组成新数组
	var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
}

function filterChapters(html,id){
	var $=cheerio.load(html);
	var id = parseInt(id);

	var chapters = $('.category');
	var seName = $('.na').find('span').text().replace(/(^\s*)|(\s*$)/g, "");
	var seAdress = $('.rest-info-thirdpart').text().replace(/(^\s*)|(\s*$)/g, "").substring(5);
	var sePhone = parseInt($('.telephone').text().replace(/(^\s*)|(\s*$)/g, "").substring(5));
	var starSend = parseInt($('.ack-ti').find('strong').text());
	var sendPrice = parseInt($('.in-ti').find('strong').text());
	var sendTime = parseInt($('.average-speed').find('strong').text());


	var goods = $('.food-nav');

	var type = Math.floor(Math.random()*6 + 1);

	var num = Math.floor(Math.random()*4 + 3);
	var sellerSupports = getRandomArrayElements(supports,num);
//JSON.stringify(jsonobj)	
// sellerData = {
// 	sellerName:sellerName,
//	sellerPhone:sellerPhone,
//  starSend:starSend,
//  sendPrice:sendPrice,
//  sendTime:sendTime,
//  sellerAdress:seAdress,
//  type:type,
//  supports:supports,
// 	goods:[
// 		{
// 			title:title,
// 			type:type,
// 			wares:[
// 				{
//					id:id
// 					name:name,
// 					price:price,
//					soldCount:soldCount,
//					image:image
// 				}
// 			]
// 		}
// 	]
// }


	var sellerData={
		id:id,
		type:type,
		sellerName:seName,
		sellerPhone:sePhone,
		starSend:starSend,
		sendPrice:sendPrice,
		sendTime:sendTime,
		sellerAdress:seAdress,
		supports:sellerSupports,
		goods:[]
	};
	chapters.each(function(item){
		var chapter = $(this);
		var title = chapter.find('h3').attr('title');
		var random = Math.floor(Math.random()*12 + 1);
		var type = -1;
		if(random >11){
			type = Math.floor(Math.random()*5 + 1)
		}
		var wares = chapter.find('.pic-food-cont').children('.pic-food');
		var chapterData = {
			title:title,
			type:type,
			wares:[]
		};

		wares.each(function(item){
			var id = parseInt($(this).attr('id'));
			var image = $(this).find('.food-shape').attr('src');
			var name = $(this).find('.name').text().substring(6).replace(/\./g,"").replace(/(^\s*)|(\s*$)/g, "");
			var soldCount = $(this).find('.sold-count').children('span').text().substring(2).replace(new RegExp('份'), "");
			var price = $(this).find('.only').text().substring(1).replace(new RegExp('\/份'), "");

			chapterData.wares.push({
				id:id,
				name:name,
				price:price,
				soldCount:soldCount,
				image:image
			});
		})
		//var good = JSON.stringify(chapterData);
		sellerData.goods.push(chapterData);
	});


	return sellerData;
};


function printSellersInfo(sellerDatas){
	datas.push(sellerDatas);
	var data = JSON.stringify(datas);
	savedContent(data);
}

http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });
    res.on('end', function () {
        filterIds(html);
    });
}).on('error', function () {
    console.log('读取数据出错了');
})

var fetchSellerArray = [];



function getPageAsync(url,id){
	var id = id;
	http.get(url, function (res) {
		res.setEncoding('utf-8');
	    var html = '';
	    res.on('data', function (data) {
	        html += data;
	    });
	    res.on('end', function () {
	       printSellersInfo(filterChapters(html,id));
	    });
	}).on('error', function () {
	    console.log('读取数据出错了');
	});	
}

function savedContent(data){        
	fs.writeFileSync('./data/data.json',data);

}





function filterIds(html){
	var $=cheerio.load(html);
	var chapters = $('.restaurant');
	chapters.each(function(item){
		var chapter = $(this);
		var sellerId = chapter.attr('data-poiid');
		sellerIds.push(sellerId);

	});

	console.log(sellerIds);
	sellerIds.forEach(function(id){
	 	getPageAsync(baseUrl +id,id);
	});
}
















