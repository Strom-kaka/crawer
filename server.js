var http = require('http');
var url = 'http://waimai.meituan.com/home/wwgnr2rsydpk';


http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });
    res.on('end', function () {
        console.log(html);
    });
}).on('error', function () {
    console.log('读取数据出错了');
})