// Netlify Function: AI聊天助手（使用DeepSeek API）
// 用于回答HTML学习相关问题

exports.handler = async (event, context) => {
  // 设置CORS头部
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 只接受POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // 获取DeepSeek API密钥
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY not configured');
      // 降级到本地知识库
      const reply = generateReply(message.toLowerCase());
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          reply,
          timestamp: new Date().toISOString()
        })
      };
    }

    // 调用DeepSeek API
    const systemPrompt = `你是一位HTML学习助手，专门帮助学生理解HTML代码。你的教学风格：
1. 使用语言学和统计学比喻来解释技术概念
2. 将HTML标签类比为英语的词性（名词、动词、形容词等）
3. 强调"识读"而非"编写"代码
4. 用简单易懂的语言，避免过于技术化
5. 回答要简洁明了，通常2-4句话即可

你是龚凤乾教授"代码即叙事"教学项目的AI助手。`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        reply,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    // 如果API调用失败，降级到本地知识库
    try {
      const { message } = JSON.parse(event.body);
      const reply = generateReply(message.toLowerCase());
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          reply: reply + '\n\n（注：当前使用本地知识库回答）',
          timestamp: new Date().toISOString()
        })
      };
    } catch (fallbackError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Internal Server Error',
          message: '抱歉，处理您的请求时出现错误。'
        })
      };
    }
  }
};

// 生成回复的核心逻辑
function generateReply(message) {
  // 关键词匹配回复系统
  const responses = {
    // HTML基础
    'html': 'HTML是HyperText Markup Language（超文本标记语言）的缩写。它是构建网页的基础语言，使用"标签"来定义内容的结构和语义。',
    
    'head': '<head>标签是网页的"简历区"，包含不直接显示的元数据，比如：\n• <title>：浏览器标签页标题\n• <meta>：字符编码、描述等\n• <link>：外部样式表\n• <script>：JavaScript脚本',
    
    'body': '<body>标签是网页的"主体区"，包含所有用户可见的内容。就像书的正文部分，文字、图片、链接等都在这里。',
    
    'div': '<div>是一个通用容器标签，本身没有特定语义，就像英语中的代词"it"。它常用于布局和样式控制，但过度使用会降低代码可读性。',
    
    // 语义化标签
    'article': '<article>标签表示独立的、完整的内容单元（如文章、博客文章）。它是语义化标签，比<div>更能表达内容的含义。',
    
    'section': '<section>表示文档中的一个主题区域，通常包含标题。它用于将内容分组，类似于书的章节。',
    
    'nav': '<nav>标签专门用于导航链接区域，比如网站的主菜单。它帮助搜索引擎和屏幕阅读器识别导航内容。',
    
    'header': '<header>表示页面或区块的头部，通常包含标题、logo、导航等。一个页面可以有多个<header>。',
    
    'footer': '<footer>表示页面或区块的底部，通常包含版权信息、联系方式等。',
    
    // 属性相关
    'class': 'class属性用于为元素添加CSS类名，就像给名词加上"形容词"。一个元素可以有多个类名（空格分隔），用于样式和JavaScript操作。',
    
    'id': 'id属性为元素提供唯一标识，就像"专有名词"。每个id在页面中必须是唯一的，常用于JavaScript选择器和页面锚点。',
    
    'href': 'href属性是Hypertext Reference（超文本引用）的缩写，用在<a>标签中指定链接目标。比如：<a href="page.html">点击</a>',
    
    'src': 'src是Source（来源）的缩写，用于指定外部资源的路径，常见于<img>、<script>等标签。比如：<img src="photo.jpg">',
    
    // 列表相关
    'ul': '<ul>是Unordered List（无序列表）的缩写，用于显示项目符号列表。每个列表项用<li>标签包裹。',
    
    'ol': '<ol>是Ordered List（有序列表）的缩写，用于显示编号列表。每个列表项会自动编号。',
    
    'li': '<li>是List Item（列表项）的缩写，必须作为<ul>或<ol>的子元素使用。',
    
    // 链接和图片
    'a标签': '<a>标签是Anchor（锚点）的缩写，用于创建超链接。它就像一个"传送门"，通过href属性指向其他页面或位置。',
    
    'img': '<img>标签用于嵌入图片，是自闭合标签。必需属性：src（图片路径）和alt（替代文本）。比如：<img src="photo.jpg" alt="描述">',
    
    // 标题
    'h1': '<h1>到<h6>是标题标签，数字越小级别越高。<h1>是最重要的标题（通常每页只有一个），<h6>是最小的标题。它们构成了文档的层级结构。',
    
    // CSS相关
    'css': 'CSS（Cascading Style Sheets）是用来为HTML添加样式的语言。HTML负责结构，CSS负责外观。可以通过<link>标签引入外部CSS，或用<style>标签写内联CSS。',
    
    'style': '<style>标签用于在HTML文档中直接编写CSS样式。通常放在<head>中。它就像给网页"化妆"。',
    
    // JavaScript相关
    'script': '<script>标签用于嵌入或引用JavaScript代码。JavaScript为网页添加交互功能，就像给网页注入"行为逻辑"。',
    
    // 语义化
    '语义化': '语义化是指使用有明确含义的HTML标签，而不是全用<div>。比如用<nav>表示导航、<article>表示文章，这样代码更易读，对SEO和无障碍访问更友好。',
    
    // BEM
    'bem': 'BEM是一种CSS类名命名规范：Block__Element--Modifier。比如：.card__title--large 表示"卡片的标题（大号）"。这种命名法提高了代码可读性和可维护性。',
    
    // 统计学相关
    '频率': '在典型网页中，<div>和<span>的出现频率最高（像英语的"the"），但语义最少。真正重要的是那些低频但高信息量的标签，如<video>、<canvas>、<article>等。',
    
    // 学习建议
    '学习': '学习HTML的最佳方法是：\n1. 先理解整体结构（树状层级）\n2. 识别常见模式（导航栏、卡片等）\n3. 关注语义化标签\n4. 用浏览器开发者工具查看真实网站的HTML\n5. 多读代码，少背语法',
    
    '工具': '推荐的学习工具：\n• Chrome DevTools（F12）：查看和调试HTML\n• VS Code：代码编辑器\n• CodePen：在线实验平台\n• MDN Web Docs：权威文档\n• W3C Validator：验证HTML代码'
  };

  // 遍历关键词匹配
  for (const [keyword, response] of Object.entries(responses)) {
    if (message.includes(keyword)) {
      return response;
    }
  }

  // 特殊问题模式匹配
  if (message.includes('什么') || message.includes('是什么')) {
    if (message.includes('标签')) {
      return '标签是HTML的基本组成单位，用尖括号<>包围。大多数标签成对出现（如<p>...</p>），少数是自闭合的（如<img>）。标签定义了内容的结构和含义。';
    }
    if (message.includes('属性')) {
      return '属性提供关于HTML元素的额外信息，写在开始标签内。格式：属性名="属性值"。常见属性包括：class（类名）、id（唯一标识）、href（链接）、src（资源路径）等。';
    }
  }

  if (message.includes('怎么') || message.includes('如何')) {
    if (message.includes('学')) {
      return '学习HTML的建议：\n1. 从基础结构开始（html, head, body）\n2. 学会识别常见模式（导航、列表、卡片）\n3. 理解语义化标签的重要性\n4. 使用浏览器开发者工具查看真实网站\n5. 多实践，从阅读别人的代码开始';
    }
    if (message.includes('区分') || message.includes('区别')) {
      return '区分HTML元素的方法：\n1. 看标签名：语义化标签（article, nav）比通用标签（div）更有意义\n2. 看属性：class用于样式分类，id用于唯一标识\n3. 看层级：父标签包含子标签，形成树状结构\n4. 看用途：容器标签定义结构，内容标签承载信息';
    }
  }

  if (message.includes('为什么')) {
    return '为什么要学HTML？\n• 它是web开发的基础\n• 理解网页结构有助于更好使用互联网\n• 即使不写代码，读懂HTML也能帮你理解网页原理\n• HTML的声明式语法类似英语，学习曲线平缓';
  }

  // 默认回复
  return '很好的问题！我是HTML学习助手，可以帮你解答：\n\n🏷️ HTML标签相关：html, head, body, div, article, section, nav等\n📝 属性相关：class, id, href, src等\n📚 概念相关：语义化、BEM命名、学习方法等\n\n试着问我："什么是div标签？"或"class和id的区别是什么？"';
}
