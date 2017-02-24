var http = require('http');
var cheerio = require('cheerio');
var url = 'http://waimai.meituan.com/home/wwgnr2rsydpk';

var data = {
	sellers:[]
};
// seller:{
// 	"id":'',
// 	"name":'',
// 	"image":'',
// 	"score":'',
// 	"starPrice":'',
// 	"sendPrice":'',
// 	"sendTime":''
// }
function filterChapters(html){
	var $=cheerio.load(html);
	var chapters = $('.restaurant');
	var sellerData=[];
	chapters.each(function(item){
		var chapter = $(this);
		var sellerId = chapter.attr('data-poiid');
		var sellerName = chapter.attr('data-title');
		var sellerScore = parseFloat(chapter.find('.score-num').text());
		var sellerImg = chapter.find('.scroll-loading').attr('src');
		var starPrice = chapter.find('.start-price').text().substring(4);
		var sendPrice = chapter.find('.send-price').text().replace(/(^\s*)|(\s*$)/g, "").substring(5);
		var sendTime = parseFloat(chapter.find('.send-time').text());
		var chapterData = {
			id : sellerId,
			name : sellerName,
			score: sellerScore,
			starPrice : starPrice,
			sendPrice : sendPrice,
			sendTime : sendTime,
			image:sellerImg
		}

		sellerData.push(chapterData);
	})
	data.sellers=sellerData;
	console.log(data);
};

http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });
    res.on('end', function () {
        filterChapters(html);
    });
}).on('error', function () {
    console.log('读取数据出错了');
})



