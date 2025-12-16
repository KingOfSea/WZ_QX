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

obj.data.user.is_vip = 2;
obj.data.user.vip_type = 4;
obj.data.user.vip_expire_at = "2099-12-31 23:59:59";
obj.data.user.is_wp = 2;

$done({ body: JSON.stringify(obj) });
