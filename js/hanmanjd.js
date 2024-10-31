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

function removeCenterScript(input) {
    // 使用正则表达式匹配 <center> 和 <script> 标签之间的内容，允许有空格、换行等
    const regex = /<center><script>[\s\S]*?<\/script><\/center>/g;
    return input.replace(regex, '');
}
let cleanedHtml = removeCenterScript(body);
// 将移除标签后的字符串返回
console.log(cleanedHtml);

$done({ body: cleanedHtml });
