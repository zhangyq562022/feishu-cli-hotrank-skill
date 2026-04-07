/**
 * 生成富文本回复
 * @param {string/array} data 回复内容/榜单数据
 * @returns 飞书富文本格式
 */
exports.generateRichText = function(data) {
  if (typeof data === "string") {
    return {
      rich_text: [
        { type: "text", text: { content: data, style: { fontSize: 14, color: "#333333" } } }
      ]
    };
  }

  // 榜单数据富文本格式化（带排名、热度标注，清晰直观）
  const richText = [
    { type: "text", text: { content: `📊 ${data[0].domain}热榜（Top15）\n\n`, style: { fontSize: 16, color: "#2563eb", fontWeight: "bold" } } }
  ];

  data.forEach(item => {
    richText.push(
      { type: "text", text: { content: `${item.rank}. `, style: { color: "#2563eb", fontWeight: "bold" } } },
      { type: "text", text: { content: `${item.title} \n` } },
      { type: "text", text: { content: `   热度：${item.hot} | 来源：${item.source} | 时间：${item.time}\n\n`, style: { color: "#666666", fontSize: 12 } } }
    );
  });

  richText.push({ type: "text", text: { content: "💡 支持导出表格、AI解读，回复对应关键词即可操作", style: { color: "#059669", fontSize: 12 } } });

  return { rich_text: richText };
};

/**
 * 错误自动修复
 * @param {object} err 错误信息
 * @param {string} input 用户输入
 * @returns 错误提示+修复建议
 */
exports.handleError = function(err, input) {
  if (err.message.includes("timeout") || err.message.includes("请求失败")) {
    return `⚠️ 获取榜单失败（网络超时）\n\n修复建议：\n1. 稍后再试\n2. 更换查询领域（如：科技热榜）\n3. 检查网络连接`;
  }
  if (err.message.includes("表格")) {
    return `⚠️ 表格导出失败\n\n修复建议：\n1. 确认飞书应用已配置正确的权限\n2. 重新输入“导出XX热榜到表格”`;
  }
  return `⚠️ 操作失败，请尝试以下方式：\n1. 重新输入关键词（如：查科技热榜）\n2. 提问AI答疑（如：AI解读娱乐热榜）\n3. 导出表格重试`;
};