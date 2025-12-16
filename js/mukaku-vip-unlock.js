// QuantumultX 重写脚本 - VIP解锁 v3.0
// 适用于 web5.mukaku.com 影视网站
// 精确匹配实际API数据结构

const url = $request.url;
let body = $response.body;

try {
  let obj = JSON.parse(body);

  // ===== 拦截 getInfo 接口 - 修改用户VIP状态 =====
  if (url.includes('/api/v1/getInfo') || url.includes('/getInfo')) {
    console.log('🔓 检测到 getInfo 接口');

    // 确认数据结构: data.user.is_vip
    if (obj.data && obj.data.user) {
      console.log('📝 原始用户信息:', JSON.stringify(obj.data.user));

      // 修改VIP状态
      obj.data.user.is_vip = 2;              // 1=普通用户 → 2=VIP用户
      obj.data.user.vip_type = 4;            // 4=永久会员
      obj.data.user.is_wp = 2;               // 1=无网盘权限 → 2=有网盘权限
      obj.data.user.vip_expire_at = "2099-12-31 23:59:59";  // 超长过期时间

      console.log('✅ 已修改为VIP会员');
      console.log('📝 修改后信息:', JSON.stringify(obj.data.user));
    } else {
      console.log('⚠️ 数据结构不匹配，请检查');
    }
  }

  // ===== 拦截影视详情接口（可选） =====
  if (url.includes('/video') || url.includes('/movie') || url.includes('/mv') || url.includes('/detail')) {
    // 如果内容需要VIP，将其改为免费
    if (obj.data && obj.data.is_vip === 2) {
      console.log('🔓 检测到VIP内容，修改为免费');
      obj.data.is_vip = 1;  // 2=需要VIP → 1=免费
      console.log('✅ 内容已改为免费访问');
    }
  }

  body = JSON.stringify(obj);
  console.log('🎉 响应修改完成');

} catch (e) {
  console.log('⚠️ 处理失败:', e.message);
  console.log('URL:', url);
}

$done({ body });
