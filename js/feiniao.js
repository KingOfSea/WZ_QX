/*
飞鸟下载 解锁vip功能

***************************
QuantumultX:

[rewrite_local]
^https:\/\/ios\.feiniaobt\.com\/wangpan\/get_config url script-response-body https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/js/feiniao.js
[mitm]
hostname = ios.feiniaobt.com

**************************/

// let obj = JSON.parse($response.body);
var obj = {
  "data" : {
    "max_parse_history" : 50,
    "last_super_cnt" : 5,
    "max_file_count" : 3000,
    "max_file_size" : 0,
    "show_new_version_dialog" : false,
    "buy_card_discount" : 0,
    "max_history" : 50,
    "vip_exp_grow" : 100,
    "web_version" : "1.7",
    "buy_card_num" : 0,
    "max_download_count" : 200,
    "max_super_parse_cnt" : 5,
    "file_count" : "0",
    "has_import" : 0,
    "max_save_count" : 30,
    "is_vip" : 1,
    "vip_exp_donate" : 360
  },
  "code" : 1
};

$done({body: JSON.stringify(obj)});