# Quantumult X ⇄ Surge 规则转换器

一个通用的 Ruby 脚本，用于在 Quantumult X 和 Surge 的规则之间进行双向转换。

## 功能特性

✅ **双向转换**
- Quantumult X → Surge
- Surge → Quantumult X

✅ **支持两种规则类型**
- **重写规则**（Rewrite Rules）：HTTP 脚本、URL 拦截
- **分流规则**（Filter Rules）：域名过滤、IP 过滤

✅ **智能处理**
- 自动检测文件格式（QX 或 Surge）
- 自动识别规则类型（重写或分流）
- 自动生成输出文件名
- 保留原始注释

## 安装要求

- Ruby 2.0+ (macOS 系统自带)

## 快速开始

```bash
# 添加执行权限（首次使用）
chmod +x rule_converter.rb

# 转换重写规则
./rule_converter.rb rewrite.conf

# 转换分流规则
./rule_converter.rb adblock.conf

# 指定输出文件名
./rule_converter.rb input.conf output.sgmodule

# 查看帮助
./rule_converter.rb
```

## 使用示例

### 示例 1：重写规则转换

**输入文件**（`rewrite.conf` - Quantumult X）：
```conf
hostname = ios.feiniaobt.com, api.example.com

# 飞鸟下载解锁VIP
^https:\/\/ios\.feiniaobt\.com\/wangpan\/get_config url script-response-body ./js/feiniao.js

# 广告拦截
^https:\/\/ads\.example\.com url reject
```

**执行命令**：
```bash
./rule_converter.rb rewrite.conf
```

**输出信息**：
```
检测到输入类型: quantumult_x
检测到规则类型: rewrite
输入文件: rewrite.conf
输出文件: ./rewrite_surge.sgmodule

✓ 转换完成！
```

**输出文件**（`rewrite_surge.sgmodule` - Surge）：
```sgmodule
#!name=重写规则
#!desc=从 Quantumult X 转换
#!system=ios

[Script]
# 飞鸟下载解锁VIP
飞鸟下载 = type=http-response, pattern=^https:\/\/ios\.feiniaobt\.com\/wangpan\/get_config, requires-body=1, max-size=0, script-path=./js/feiniao.js

[URL Rewrite]
# 广告拦截
^https:\/\/ads\.example\.com - reject

[MITM]
hostname = %APPEND% ios.feiniaobt.com, api.example.com
```

### 示例 2：分流规则转换

**输入文件**（`adblock.conf` - Quantumult X）：
```conf
# AdRule广告规则
DOMAIN-SUFFIX, lichengyu.com, REJECT
DOMAIN-SUFFIX, ads.example.com, REJECT

# 字节跳动广告
DOMAIN-SUFFIX, pangolin-sdk-toutiao.com, REJECT
DOMAIN-SUFFIX, bytescm.com, REJECT
```

**执行命令**：
```bash
./rule_converter.rb adblock.conf
```

**输出信息**：
```
检测到输入类型: quantumult_x
检测到规则类型: filter
输入文件: adblock.conf
输出文件: ./adblock_surge.list

✓ 转换完成！
```

**输出文件**（`adblock_surge.list` - Surge）：
```list
# AdRule广告规则
DOMAIN-SUFFIX, lichengyu.com, REJECT
DOMAIN-SUFFIX, ads.example.com, REJECT

# 字节跳动广告
DOMAIN-SUFFIX, pangolin-sdk-toutiao.com, REJECT
DOMAIN-SUFFIX, bytescm.com, REJECT
```

### 示例 3：反向转换（Surge → Quantumult X）

```bash
# Surge 模块 → QX 配置
./rule_converter.rb rewrite_surge.sgmodule rewrite_qx.conf

# Surge 规则列表 → QX 配置
./rule_converter.rb adblock_surge.list adblock_qx.conf
```

## 规则类型详解

### 重写规则（Rewrite Rules）

用于修改 HTTP 请求/响应或拦截 URL。

**支持的规则**：
- `url script-response-body` - 修改响应内容
- `url script-request-body` - 修改请求内容
- `url script-response-header` - 修改响应头
- `url script-request-header` - 修改请求头
- `url reject` - 拦截请求
- `hostname` - MITM 主机名配置

**输出格式**：`.sgmodule` (Surge 模块)

### 分流规则（Filter Rules）

用于域名、IP 地址的分流和过滤。

**支持的规则**：
- `DOMAIN` - 完整域名匹配
- `DOMAIN-SUFFIX` - 域名后缀匹配
- `DOMAIN-KEYWORD` - 域名关键字匹配
- `IP-CIDR` - IPv4 地址段
- `IP-CIDR6` - IPv6 地址段
- `IP-ASN` - ASN 匹配
- `USER-AGENT` - User-Agent 匹配
- `URL-REGEX` - URL 正则匹配
- `GEOIP` - 地理位置匹配
- `FINAL` - 最终匹配

**输出格式**：`.list` (Surge 规则列表)

> 📝 **注意**：分流规则在 QX 和 Surge 中格式基本相同，转换器主要负责格式验证和注释保留。

## 格式对照表

### 重写规则格式

| 功能 | Quantumult X | Surge |
|------|--------------|-------|
| 响应脚本 | `^pattern url script-response-body path.js` | `Name = type=http-response, pattern=^pattern, requires-body=1, script-path=path.js` |
| 请求脚本 | `^pattern url script-request-body path.js` | `Name = type=http-request, pattern=^pattern, requires-body=1, script-path=path.js` |
| URL 拦截 | `^pattern url reject` | `^pattern - reject` |
| MITM | `hostname = example.com, *.domain.com` | `hostname = %APPEND% example.com, *.domain.com` |

### 分流规则格式（基本相同）

| 规则类型 | 格式示例 |
|---------|---------|
| 域名后缀 | `DOMAIN-SUFFIX, example.com, REJECT` |
| 完整域名 | `DOMAIN, api.example.com, DIRECT` |
| IP 地址段 | `IP-CIDR, 192.168.0.0/16, DIRECT` |
| User-Agent | `USER-AGENT, App*, PROXY` |

## 输出文件说明

转换器会根据规则类型自动选择输出格式：

| 输入 | 规则类型 | 输出格式 | 用途 |
|------|---------|---------|------|
| `rewrite.conf` | 重写规则 | `rewrite_surge.sgmodule` | Surge 模块 |
| `adblock.conf` | 分流规则 | `adblock_surge.list` | Surge 规则列表 |
| `xxx.sgmodule` | 重写规则 | `xxx_qx.conf` | QX 配置 |
| `xxx.list` | 分流规则 | `xxx_qx.conf` | QX 配置 |

## 在客户端中使用

### Surge 使用方法

**重写规则（模块）**：
```ini
[Module]
rewrite_surge.sgmodule

# 或远程模块
https://example.com/rewrite_surge.sgmodule
```

**分流规则（规则集）**：
```ini
[Rule]
RULE-SET,https://example.com/adblock_surge.list,REJECT
# 或
RULE-SET,LOCAL,adblock_surge.list,REJECT
```

### Quantumult X 使用方法

**重写规则**：
```ini
[rewrite_remote]
https://example.com/rewrite.conf, tag=重写规则, enabled=true

[rewrite_local]
# 或直接粘贴规则内容
```

**分流规则**：
```ini
[filter_remote]
https://example.com/adblock.conf, tag=广告拦截, force-policy=reject, enabled=true

[filter_local]
# 或直接粘贴规则内容
```

## 高级用法

### 批量转换

**转换目录下所有 QX 配置**：
```bash
for file in *.conf; do
  ./rule_converter.rb "$file"
done
```

**转换目录下所有 Surge 文件**：
```bash
for file in *.sgmodule *.list; do
  ./rule_converter.rb "$file"
done
```

### 调试模式

遇到问题时启用调试模式：
```bash
DEBUG=1 ./rule_converter.rb input.conf
```

### 使用 Ruby 命令

如果不想添加执行权限：
```bash
ruby rule_converter.rb input.conf
```

## 常见问题

### Q1: 如何判断我的文件是什么规则类型？

**A:** 简单判断方法：
- 包含 `url script-` 或 `url reject` → 重写规则
- 包含 `DOMAIN-SUFFIX`、`IP-CIDR` 等 → 分流规则
- 不确定？直接运行转换器，它会自动识别

### Q2: 转换后的脚本路径不正确怎么办？

**A:** 转换器会保留原始路径。如果路径不适用于目标平台，请手动编辑输出文件：
- 相对路径：`./js/script.js`
- 绝对路径：`https://example.com/script.js`

### Q3: 为什么分流规则转换前后几乎一样？

**A:** 因为 QX 和 Surge 的分流规则格式本就相同。转换器主要作用是：
- 验证规则格式
- 保留和整理注释
- 统一文件格式

### Q4: 转换后规则不生效怎么办？

**A:** 检查清单：
- ✅ 脚本路径是否可访问
- ✅ 重写规则是否配置了 MITM 主机名
- ✅ 是否启用了对应的模块/规则集
- ✅ 客户端是否重载配置

### Q5: 中文注释显示乱码？

**A:** 确保原文件使用 UTF-8 编码保存。

### Q6: 可以转换远程规则吗？

**A:** 不能直接转换 URL。请先下载文件：
```bash
curl -O https://example.com/rules.conf
./rule_converter.rb rules.conf
```

## 注意事项

1. **脚本路径**
   - 相对路径会原样保留，请确保在目标平台上可访问
   - URL 路径直接转换，建议使用 GitHub Raw 或 CDN

2. **MITM 证书**
   - 重写规则需要配置 MITM 证书才能生效
   - 确保客户端已正确安装并信任证书

3. **规则命名**
   - Surge 重写规则需要名称，转换器会从注释中提取
   - 建议在 QX 规则前添加描述性注释

4. **文件编码**
   - 所有文件使用 UTF-8 编码
   - 避免使用 BOM 头

5. **规则顺序**
   - 转换会保留原始规则顺序
   - 注释会附加到对应规则之前

## 暂不支持的功能

❌ 以下类型的规则暂不支持：
- `url 302` 重定向规则
- `url request-header` 替换规则（非脚本）
- `url response-header` 替换规则（非脚本）
- 复杂的正则替换规则
- TCP/UDP 规则

如需支持这些功能，欢迎提交 Issue 或 PR。

## 实际应用场景

### 场景 1：从 Quantumult X 迁移到 Surge
```bash
# 1. 转换所有配置文件
./rule_converter.rb rewrite.conf
./rule_converter.rb adblock.conf

# 2. 在 Surge 中导入生成的文件
# - rewrite_surge.sgmodule → 模块
# - adblock_surge.list → 规则集
```

### 场景 2：维护跨平台规则库
```bash
# 1. 维护 QX 格式的主规则文件
# 2. 使用脚本生成 Surge 版本
./rule_converter.rb master_rewrite.conf
./rule_converter.rb master_filter.conf

# 3. 分发给不同平台用户
```

### 场景 3：快速测试规则
```bash
# 在不同平台间快速转换规则进行测试
./rule_converter.rb test.conf        # QX → Surge
./rule_converter.rb test_surge.sgmodule test.conf  # Surge → QX
```

## 贡献指南

欢迎贡献代码和建议！

**提交 Issue**：
- Bug 报告
- 功能建议
- 规则转换问题

**Pull Request**：
- 修复 Bug
- 添加新功能
- 改进文档

## 许可证

MIT License

---

## 更新日志

### v2.0 (2026-02-02)
- ✨ 支持分流规则转换
- ✨ 智能识别规则类型
- ✨ 自动选择输出格式
- 🐛 修复注释保留问题
- 📝 完善使用文档

### v1.0
- ✨ 基础重写规则转换
- ✨ 双向转换支持
- ✨ MITM 配置处理

---

**Made with ❤️ for Quantumult X & Surge users**
