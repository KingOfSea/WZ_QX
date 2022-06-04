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

// let obj = JSON.parse($response.body);
var obj = {
  "data" : {
    "max_parse_history" : 5,
    "last_super_cnt" : 0,
    "max_file_count" : 10,
    "max_file_size" : 4294967296,
    "show_new_version_dialog" : false,
    "max_history" : 10,
    "vip_exp_grow" : 0,
    "web_version" : "1.7",
    "max_download_count" : 5,
    "max_super_parse_cnt" : 0,
    "file_count" : "0",
    "has_import" : 0,
    "max_save_count" : 1,
    "is_vip" : 0
  },
  "code" : 1
};

$done({body: JSON.stringify(obj)});