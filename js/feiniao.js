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