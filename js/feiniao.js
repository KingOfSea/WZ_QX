/*
JibJab 解锁高级功能

***************************
QuantumultX:

[rewrite_local]
https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/jibjab.js

[mitm]
hostname = origin-prod-phoenix.jibjab.com

***************************
Surge4 or Loon:

[Script]
http-response https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/jibjab.js

[MITM]
hostname = origin-prod-phoenix.jibjab.com

**************************/

let obj = JSON.parse($response.body);

obj.data.attributes["data"] = {
    "max_parse_history" : 50,
    "last_super_cnt" : 5,
    "max_file_count" : 3000,
    "max_file_size" : 0,
    "show_new_version_dialog" : false,
    "buy_card_discount" : 0,
    "max_history" : 50,
    "vip_exp_grow" : 15,
    "web_version" : "1.7",
    "buy_card_num" : 0,
    "max_download_count" : 200,
    "max_super_parse_cnt" : 5,
    "file_count" : "0",
    "has_import" : 0,
    "max_save_count" : 30,
    "is_vip" : 0,
    "vip_exp_donate" : 30
};

$done({body: JSON.stringify(obj)});