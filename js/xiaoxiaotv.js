/*
# 小小影视去广告

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
var obj = JSON.parse($response.body);

obj.data.iOS_adgroups = {};
obj.data.Android_adgroups = {};
obj.data.adrows = [];
obj.data.adgroups = {};
obj.data.app_launch_type_adshow = {};

$done({ body: JSON.stringify(obj) });
