const { LLamaIndex } = require('llama-index');

// 初始化轻量AI模型
const aiModel = new LLamaIndex({
  model: "llama3",
  temperature: 0.7,
  maxTokens: 500
});

/**
 * AI意图识别 + 智能答疑
 * @param {string} input 用户输入
 * @param {boolean} isQA 是否为答疑模式
 * @returns 意图/答疑结果
 */
exports.handleAIQuery = async function(input, isQA = false) {
  if (isQA) {
    // AI答疑：解读榜单、对比榜单、热度分析
    const prompt = `基于飞书热榜场景，简洁、精准回答用户问题：${input}，不要多余内容，贴合办公场景需求。`;
    const response = await aiModel.generate(prompt);
    return response.text.trim();
  }

  // 意图识别：区分查询、导出、答疑三种核心场景
  const prompt = `用户输入：${input}，请判断意图，仅返回以下关键词之一：rank_query（榜单查询）、export_table（导出表格）、ai_qa（智能答疑），并补充领域（如科技、娱乐、综合），格式：{intent: "关键词", domain: "领域"}`;
  const response = await aiModel.generate(prompt);
  try {
    return JSON.parse(response.text.trim());
  } catch (err) {
    // 意图识别失败降级（鲁棒性优化）
    if (/导出|表格/.test(input)) return { intent: "export_table", domain: "综合" };
    if (/AI|解读|答疑/.test(input)) return "ai_qa";
    return { intent: "rank_query", domain: "综合" };
  }
};