/*
# 墨迹天气解锁vip

***************************
QuantumultX:

[rewrite_local]
^https:\/\/psnlz\.api\.moji\.com\/.+?\/user-conf-server\/diamondConf url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/moji.js

[mitm]
hostname = psnlz.api.moji.com

**************************/

var body = $response.body;
var obj = JSON.parse($response.body);

obj.common.vip = "1";

$done({ body: JSON.stringify(obj) });
