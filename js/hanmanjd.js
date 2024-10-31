/*
# 韩漫基地去广告

***************************
QuantumultX:

[rewrite_local]
^https:\/\/.+?\.gqbyh\.com\/getGlobalData url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/xiaoxiaotv.js

^https:\/\/.+?\.syzcny\.com\/getGlobalData url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/xiaoxiaotv.js

^https:\/\/.+?\.hnhx360\.com\/getGlobalData url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/xiaoxiaotv.js

[mitm]
hostname = *.gqbyh.com, *.syzcny.com, *.hnhx360.com

**************************/

var body = $response.body;
// 假设你已经有了包含上述HTML的元素
const conchContent = document.querySelector('#conch-content');

// 使用正则表达式找到并移除目标脚本标签
const cleanedHtml = conchContent.innerHTML.replace(/<script.*?<\/script>/gs, '');

// 将移除标签后的字符串返回
console.log(cleanedHtml);

$done({ body: cleanedHtml });
