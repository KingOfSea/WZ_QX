/*
# 西窗烛解锁vip

***************************
QuantumultX:

^https:\/\/lchttpapi\.xczim\.com\/.+?\/users\/me url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/xcz.js

[mitm]
hostname = lchttpapi.xczim.com

**************************/

var body = $response.body;
var obj = JSON.parse($response.body);

// obj.didGiveOneMonthMembershipForQQAndroidPro = 1;
obj.membership = 1;
obj.lifetimeMembership = 1;
obj.premiumMembership = 1;
// obj.isAdmin = 1;

$done({ body: JSON.stringify(obj) });
