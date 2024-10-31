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
function removeMaliciousTags(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 移除所有包含特定类名的元素
    const elements = doc.querySelectorAll('.palojsil_b');
    elements.forEach(element => element.remove());
    
    return doc.body.innerHTML;
}

// 示例用法
const originalHtml = body; // 在这里插入你的HTML字符串
const cleanedHtml = removeMaliciousTags(originalHtml);

$done({ body: cleanedHtml });
