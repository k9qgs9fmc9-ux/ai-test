// Mock product data
export const products = [
  {
    id: 1,
    name: "智能降噪耳机 Pro",
    price: 1299,
    description: "主动降噪，30小时超长续航，支持透明模式，蓝牙5.2连接。",
    stock: 50
  },
  {
    id: 2,
    name: "极速机械键盘 K8",
    price: 499,
    description: "RGB背光，热插拔轴体，PBT键帽，全键无冲，适合电竞游戏。",
    stock: 120
  },
  {
    id: 3,
    name: "超清4K显示器 U27",
    price: 2499,
    description: "27英寸IPS面板，HDR400认证，Type-C一线通，99% sRGB色域。",
    stock: 30
  },
  {
    id: 4,
    name: "便携式固态硬盘 T7",
    price: 899,
    description: "1TB容量，读写速度高达1050MB/s，金属机身，防摔耐用。",
    stock: 80
  },
  {
    id: 5,
    name: "人体工学椅 ErgoPro",
    price: 1599,
    description: "自适应腰托，3D扶手，透气网布，135度大角度后仰。",
    stock: 15
  }
];

export const getSystemPromptWithProducts = () => {
  const productList = products.map(p => 
    `- ${p.name}: 价格${p.price}元。特点：${p.description} (库存：${p.stock})`
  ).join('\n');

  return `你是一个专业的电商客服助手。请根据以下商品信息回答客户的问题。如果客户问到列表之外的商品，请礼貌地告知我们暂时没有该商品。

商品列表：
${productList}

请用亲切、专业的语气回答。`;
};
