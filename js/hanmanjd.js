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
// 假设你的HTML内容存储在一个变量中
let htmlContent = $response.body; // 这里是你的HTML文本

// 创建一个DOM元素来解析HTML
let container = document.createElement('div');
container.innerHTML = htmlContent;

// 选择要删除的元素
let elementsToRemove = container.querySelectorAll('.palojsil_b');

// 遍历并移除每个元素
elementsToRemove.forEach(element => {
    element.remove();
});

// 如果需要，可以将修改后的HTML提取出来
let updatedHtmlContent = container.innerHTML;

$done({ body: updatedHtmlContent });
