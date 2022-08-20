/*
# 充电助手解锁vip

***************************
QuantumultX:

[rewrite_local]
^https:\/\/api\.yonekura\.cn\/.+?\/uicommon\/getuser url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/yonekura.js

[mitm]
hostname = api.yonekura.cn

**************************/

var body = $response.body;
var obj = JSON.parse($response.body);

obj.data.vip = "1";
obj.data.isVip = "1";
obj.data.lastBuyTime = "1604895034";
obj.data.times = "999";
obj.data.score = "999";

$done({ body: JSON.stringify(obj) });
