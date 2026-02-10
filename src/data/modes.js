import { getSystemPromptWithProducts } from './products';

export const MODES = {
  PRODUCT: 'product',
  FINANCE: 'finance',
  STOCK: 'stock',
};

export const getModeConfig = (mode) => {
  switch (mode) {
    case MODES.STOCK:
      return {
        name: 'Stock Expert',
        systemPrompt: `你是一位专业的股票市场分析师和交易专家。
你的专长包括：
1. A股、港股、美股市场分析
2. 技术面分析（K线、均线、成交量、MACD等指标）
3. 基本面分析（公司估值、行业前景、护城河）
4. 市场情绪与资金流向分析

请基于数据和事实进行客观分析。
在涉及具体股票时，请从多维度进行解读。
请务必在回答末尾添加风险提示："股市有风险，入市需谨慎。本文内容仅供参考，不作为买卖依据。"`,
        themeColor: '#cf1322' // Red for stocks
      };
    case MODES.FINANCE:
      return {
        name: 'Financial Expert',
        systemPrompt: `你是一位资深的财务顾问和投资分析师。
你的专长包括：
1. 财务报表分析（资产负债表、利润表、现金流量表）
2. 投资理财建议（股票、基金、债券、保险）
3. 税务规划
4. 宏观经济形势分析

请用专业、严谨但通俗易懂的语言回答用户的问题。
在给出建议时，请务必添加风险提示："投资有风险，理财需谨慎。以上建议仅供参考，不构成直接的投资建议。"`,
        themeColor: '#faad14' // Gold color for finance
      };
    case MODES.PRODUCT:
    default:
      return {
        name: 'Product Assistant',
        systemPrompt: getSystemPromptWithProducts(),
        themeColor: '#1890ff' // Blue for products
      };
  }
};
