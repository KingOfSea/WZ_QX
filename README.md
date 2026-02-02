# Quantumult X 规则和脚本仓库

本仓库包含 Quantumult X 的重写规则、分流规则和实用工具脚本。

## 📦 内容

### 规则文件

- **`rewrite.conf`** - 重写规则（解锁VIP、去广告等）
- **`adblock.conf`** - 广告拦截分流规则

### 转换工具

- **`rule_converter.rb`** - Quantumult X ⇄ Surge 规则转换器

## 🚀 快速开始

### 使用规则

**Quantumult X 配置**：

```ini
[rewrite_remote]
https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/rewrite.conf, tag=重写规则, enabled=true

[filter_remote]
https://raw.githubusercontent.com/KingOfSea/WZ_QX/master/adblock.conf, tag=广告拦截, force-policy=reject, enabled=true
```

### 使用转换器

```bash
# 安装（首次使用）
chmod +x rule_converter.rb

# 转换 QX 规则到 Surge
./rule_converter.rb rewrite.conf      # 生成 rewrite_surge.sgmodule
./rule_converter.rb adblock.conf      # 生成 adblock_surge.list

# 转换 Surge 规则到 QX
./rule_converter.rb xxx.sgmodule      # 生成 xxx_qx.conf
./rule_converter.rb xxx.list          # 生成 xxx_qx.conf
```

## 🛠️ 规则转换器

一个智能的双向转换工具，支持：

- ✅ 重写规则（HTTP 脚本、URL 拦截）
- ✅ 分流规则（域名过滤、IP 过滤）
- ✅ 自动识别规则类型
- ✅ 保留原始注释
- ✅ 双向转换（QX ⇄ Surge）

### 转换示例

**重写规则**：
```bash
$ ./rule_converter.rb rewrite.conf
检测到输入类型: quantumult_x
检测到规则类型: rewrite
输出文件: ./rewrite_surge.sgmodule
✓ 转换完成！
```

**分流规则**：
```bash
$ ./rule_converter.rb adblock.conf
检测到输入类型: quantumult_x
检测到规则类型: filter
输出文件: ./adblock_surge.list
✓ 转换完成！
```

## 📖 详细文档

查看完整使用说明：**[CONVERTER_README.md](CONVERTER_README.md)**

内容包括：
- 详细使用方法
- 规则格式对照表
- 实际应用场景
- 常见问题解答
- 批量转换脚本

## 📋 重写规则说明

当前 `rewrite.conf` 包含的功能：

- 🚀 **飞鸟下载** - VIP 解锁
- 📺 **小小影视** - 去广告
- 🌤️ **墨迹天气** - 去广告 + VIP 解锁
- 🎵 **Musi** - 去广告
- 📖 **西窗烛** - VIP 解锁
- 📚 **韩漫基地** - 去广告
- 🎬 **不太灵** - VIP 解锁

> ⚠️ **免责声明**：这些规则仅供学习研究使用，请支持正版应用。

## 📋 分流规则说明

当前 `adblock.conf` 包含的广告域名拦截：

- 🚫 通用广告域名
- 🚫 字节跳动广告（今日头条、西瓜视频等）
- 🚫 其他追踪域名

## 🔧 要求

- **Quantumult X**：iOS 13.0+
- **Surge**：iOS 版本 4.0+ / Mac 版本 3.0+
- **Ruby**：2.0+（转换器需要，macOS 自带）

## 📝 使用说明

### Quantumult X

1. 打开 Quantumult X
2. 配置文件 → 编辑
3. 在对应区块添加远程规则链接
4. 保存并重载配置

### Surge

使用转换器生成 Surge 版本：

```bash
# 生成模块文件
./rule_converter.rb rewrite.conf
# 在 Surge 中导入 rewrite_surge.sgmodule

# 生成规则列表
./rule_converter.rb adblock.conf
# 在 Surge 配置中添加规则集
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- ➕ 添加新规则

## ⚠️ 注意事项

1. **MITM 证书**：重写规则需要配置并信任 MITM 证书
2. **脚本路径**：确保脚本文件路径可访问
3. **定期更新**：应用更新可能导致规则失效，请及时更新
4. **合法使用**：请遵守相关法律法规，仅用于学习研究

## 📜 许可证

MIT License

---

**Star ⭐ 本项目如果它对你有帮助！**
