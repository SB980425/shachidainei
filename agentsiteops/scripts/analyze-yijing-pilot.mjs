import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sources = [
  {
    book: "上经",
    file: "C:\\Users\\98043\\Desktop\\易经六十四卦_上经.txt"
  },
  {
    book: "下经",
    file: "C:\\Users\\98043\\Desktop\\易经六十四卦_下经.txt"
  }
];

const sampleHexagramNos = new Set([1, 2, 3, 4, 5, 6]);

function csvEscape(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows, columns) {
  return [
    columns.map(csvEscape).join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ].join("\n") + "\n";
}

function compact(value) {
  return String(value ?? "")
    .replace(/```text/g, "")
    .replace(/```/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstMatch(text, pattern) {
  const match = text.match(pattern);
  return match ? compact(match[1]) : "";
}

function extractBetween(text, startLabel, stopPattern) {
  const start = text.indexOf(startLabel);
  if (start < 0) return "";
  const body = text.slice(start + startLabel.length);
  const stop = body.search(stopPattern);
  return compact(stop >= 0 ? body.slice(0, stop) : body);
}

function extractLineFields(text) {
  const labels = ["简义", "深义", "现实处境", "做法", "人间道", "吉凶"];
  const matches = [
    ...text.matchAll(/(?:^|\n)(简义|深义|现实处境|做法|人间道|吉凶)：/g)
  ];
  const fields = Object.fromEntries(labels.map((label) => [label, ""]));

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const label = match[1];
    const contentStart = (match.index ?? 0) + match[0].length;
    const nextStart = matches[index + 1]?.index ?? text.length;
    fields[label] = compact(text.slice(contentStart, nextStart));
  }

  return fields;
}

function splitHexagrams(source) {
  const text = readFileSync(source.file, "utf8");
  const matches = [...text.matchAll(/\*\*第(\d+)卦\s+([^*]+?)\*\*/g)];

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? text.length;
    return {
      no: Number(match[1]),
      name: match[2].trim(),
      book: source.book,
      body: text.slice(start, end)
    };
  });
}

function splitLines(hexagram) {
  const matches = [
    ...hexagram.body.matchAll(
      /\*\*((?:初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六|用九|用六)：[^*]+?)\*\*/g
    )
  ];

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? hexagram.body.length;
    const title = match[1].trim();
    const [position, lineText = ""] = title.split("：");
    const rawBody = hexagram.body.slice(start, end);
    const majorSectionStart = rawBody.search(/\n\*\*(?:八|九|十|十一|十二|[一二三四五六七八九十]+)、/);
    const body = majorSectionStart > 0 ? rawBody.slice(0, majorSectionStart) : rawBody;
    const fields = extractLineFields(body);

    return {
      no: hexagram.no,
      hexagram: hexagram.name,
      position,
      line_text: lineText,
      simple_meaning: fields["简义"],
      deep_meaning: fields["深义"],
      real_situation: fields["现实处境"],
      action: fields["做法"],
      human_use: fields["人间道"],
      fortune: fields["吉凶"]
    };
  });
}

function classifyAction(action, fortune) {
  const text = `${action}\n${fortune}`;
  if (/等待|潜藏|勿用|不可急|守|静|忍|谨慎/.test(text)) return "守时";
  if (/退|避|止|舍|脱|离|不争/.test(text)) return "退避";
  if (/进|见|求|行|建立|决断|改革|突破/.test(text)) return "进取";
  if (/正|中|诚|贞|德|礼|敬/.test(text)) return "守正";
  if (/凶|悔|吝|险|伤|败/.test(text)) return "避险";
  return "待辨";
}

const hexagrams = sources.flatMap(splitHexagrams).sort((a, b) => a.no - b.no);
const allLines = hexagrams.flatMap(splitLines);
const sampleLines = allLines
  .filter((line) => sampleHexagramNos.has(line.no))
  .map((line) => ({
    ...line,
    action_tag: classifyAction(line.action, line.fortune)
  }));

const hexagramRows = hexagrams.map((hexagram) => {
  const lineCount = splitLines(hexagram).length;
  return {
    no: hexagram.no,
    name: hexagram.name,
    book: hexagram.book,
    line_count: lineCount,
    has_natural_image: hexagram.body.includes("自然象"),
    has_tuan: hexagram.body.includes("彖传"),
    has_xiang: hexagram.body.includes("象传"),
    has_najia: hexagram.body.includes("纳甲"),
    has_yangzhai: hexagram.body.includes("阳宅"),
    core_summary: firstMatch(hexagram.body, /所以[^：\n]*讲的是：\*\*([^*]+)\*\*/)
  };
});

const opportunityRows = [
  {
    candidate: "易经处境辨象与行动路线图系统",
    site_type: "方法库 + 处境识别工具 + 样本路线图",
    search_demand: 3,
    entrant_angle: 4,
    serp_opportunity: 3,
    commercial_intent: 2,
    content_gap: 5,
    original_value: 5,
    maintenance_ease: 2,
    moat: 4,
    monetization_fit: 2,
    compliance_safety: 2,
    data_source: 4,
    ai_production_fit: 4,
    pseo_fit: 4,
    verifiability_90d: 3,
    weighted_score_100: 63.2,
    decision: "pilot",
    notes:
      "资料结构强、原创整理价值高，适合作为 AgentSiteOps 路线图能力测试；但版权边界、预测误用风险、商业意图和外部需求仍未验证。"
  }
];

mkdirSync("data", { recursive: true });
mkdirSync("docs", { recursive: true });

writeFileSync(
  "data/yijing-hexagram-index.csv",
  toCsv(hexagramRows, [
    "no",
    "name",
    "book",
    "line_count",
    "has_natural_image",
    "has_tuan",
    "has_xiang",
    "has_najia",
    "has_yangzhai",
    "core_summary"
  ]),
  "utf8"
);

writeFileSync(
  "data/yijing-sample-line-map.csv",
  toCsv(sampleLines, [
    "no",
    "hexagram",
    "position",
    "line_text",
    "simple_meaning",
    "real_situation",
    "action",
    "fortune",
    "action_tag"
  ]),
  "utf8"
);

writeFileSync(
  "data/yijing-opportunity-scorecard.csv",
  toCsv(opportunityRows, [
    "candidate",
    "site_type",
    "search_demand",
    "entrant_angle",
    "serp_opportunity",
    "commercial_intent",
    "content_gap",
    "original_value",
    "maintenance_ease",
    "moat",
    "monetization_fit",
    "compliance_safety",
    "data_source",
    "ai_production_fit",
    "pseo_fit",
    "verifiability_90d",
    "weighted_score_100",
    "decision",
    "notes"
  ]),
  "utf8"
);

const sampleOverview = sampleHexagramNos
  .values()
  .toArray()
  .map((no) => {
    const hexagram = hexagramRows.find((row) => row.no === no);
    const lines = sampleLines.filter((line) => line.no === no);
    return `### ${no}. ${hexagram?.name ?? ""}

- 样本爻数：${lines.length}
- 核心摘要：${hexagram?.core_summary || "待人工压缩"}
- 初步行动标签：${[...new Set(lines.map((line) => line.action_tag))].join(" / ")}
`;
  })
  .join("\n");

writeFileSync(
  "docs/yijing-route-pilot.md",
  `# 易经处境辨象与行动路线图系统：第一轮内部路线测试

## 结论

- 当前课题可作为 AgentSiteOps 第一条真实路线测试。
- 决策为 \`pilot\`，不进入完整建站或付费承诺。
- 第一阶段只研究上经样本，建立内部样本库、处境识别模板、相似卦爻辨析表和 4-8 卦演示，不做“预测结果”或“占卜保证”。
- 下经不进入第一轮执行；咸、恒等下经卦只保留为后续扩展候选，避免上下经样本混杂。

## 为什么适合作为测试课题

1. 源文件结构完整，包含 64 卦、逐爻、自然象、彖传、象传、纳甲、阳宅、人间用法、吉凶。
2. 课题天然考验路线图能力：从复杂文本压缩到现实处境、时机判断、行动边界、无咎条件。
3. 与 AgentSiteOps 的核心能力匹配：不是生成文章，而是把大量材料转成可判断、可执行、可拒绝的路线。

## 当前不进入正式站点的原因

- 搜索需求未验证。
- 版权边界未验证，尤其是倪海厦讲法相关内容不能直接做搬运式公开页面。
- 解释风险较高，不能让用户把结果当作医疗、法律、投资、婚姻等确定性建议。
- 商业意图未验证，当前更适合作为内部方法验证和样本系统。

## 第一版路线定义

\`\`\`text
产品名：易经处境辨象与行动路线图系统
定位：把复杂卦爻资料转成当下处境识别、相似卦爻辨析、行动边界和无咎路线。
非定位：不做算命、不做保证结果、不替代专业建议、不承诺趋吉避凶。
\`\`\`

## 样本卦选择

${sampleOverview}

## 第一阶段交付物

1. \`data/yijing-hexagram-index.csv\`：64 卦结构索引。
2. \`data/yijing-sample-line-map.csv\`：乾、坤、屯、蒙、需、讼样本逐爻映射。
3. \`data/yijing-opportunity-scorecard.csv\`：第一版机会评分。
4. \`docs/yijing-route-research-brief.md\`：Deep Research 研究提示词和验收门槛。
5. \`docs/yijing-90-day-validation.md\`：90 天验证条件。

## 核心输出模板

\`\`\`text
卦：
爻：
自然象：
现实处境：
最容易误判成的相似卦爻：
区别关键：
宜：
忌：
吉的守法：
凶的脱险法：
无咎条件：
吝的来源：
下一步行动：
不能输出的内容：
\`\`\`

## 下一步

- 用样本逐爻表先做“乾、坤、屯、蒙、需、讼”六卦的处境路线图。
- 对每爻增加“相似爻差异字段”，优先解决重复和相似问题。
- 再用 Deep Research 对方法边界、版权边界、教育型产品可行性、搜索入口进行外部验证。
`,
  "utf8"
);

writeFileSync(
  "docs/yijing-route-research-brief.md",
  `# 易经处境辨象系统：Deep Research 研究课题

## 研究目标

研究如何先把《易经》上经三十卦与对应爻位，从传统文本解释转成现代处境识别、时机判断、行动边界、风险提示和记忆辨析系统。第一轮不混入下经；目标不是占卜预测，而是建立一个可复核的教育型路线图方法。

## 必须回答的问题

1. “不易、变易、简易”如何转成可操作的处境识别框架。
2. 如何把每一卦压缩成：自然象、核心时机、现实处境、宜、忌、无咎条件、吝的来源。
3. 如何把每一爻压缩成：位置、时机、阴阳变化、风险点、行动建议、变爻方向。
4. 如何区分相似卦、相似爻，避免只靠关键词记忆。
5. 哪些内容适合做公开教育内容，哪些内容必须保留为个人学习笔记或引用摘要。
6. 如何避免把系统误用为医疗、法律、投资、婚姻等高风险确定性建议。
7. 适合的第一版产品形态：文章库、查询工具、记忆卡片、处境问答、课程笔记、还是内部知识库。
8. 90 天内如何验证是否值得继续公开建站。

## 研究输入

- 已整理的上经文本。
- 下经文本只作为后续扩展边界，不进入第一轮样本研究。
- 上经六卦样本：乾、坤、屯、蒙、需、讼。
- 目标输出：处境识别路线图，不是预测。

## 输出格式

请按以下结构输出：

1. 总结结论：是否适合做公开项目，还是只适合内部知识库。
2. 产品定位建议。
3. 用户场景分层。
4. 内容结构建议。
5. 卦爻标准化字段。
6. 相似卦爻辨析方法。
7. 风险和版权边界。
8. 第一批样本卦建议。
9. 30/60/90 天验证计划。
10. 明确停止条件。

## 验收门槛

研究结果必须包含：

- 不少于 8 个可执行字段。
- 不少于 5 类现实处境分类。
- 不少于 5 条误用风险。
- 不少于 5 条相似卦爻区分方法。
- 明确说明此系统不能承诺预测结果。

## 二次研究触发条件

如果研究报告缺少以下任一部分，则需要二次研究：

- 没有讲清楚版权和引用边界。
- 没有提出相似卦爻区分方法。
- 只讲传统义理，没有落到现实处境识别。
- 把项目建议成占卜预测工具。
- 没有给出 90 天验证条件。
`,
  "utf8"
);

writeFileSync(
  "docs/yijing-90-day-validation.md",
  `# 易经处境辨象系统：90 天验证计划

## 当前决策

\`pilot\`。只做样本验证，不公开承诺完整产品。

## 第 0-7 天

- 完成 6 个样本卦的逐爻处境路线图。
- 每爻必须有：现实处境、宜、忌、无咎条件、吝的来源、相似爻区别。
- 完成一个“我现在在哪一卦哪一爻”的问答式输入草案。

通过条件：
- 至少 36 个样本爻能被压缩成统一字段。
- 至少 12 组相似爻可以被清晰区分。

停止条件：
- 资料无法稳定转成统一字段。
- 相似卦爻无法区分，只能重复解释。

## 第 8-30 天

- 扩展到 12-16 卦。
- 做一个内部检索表或页面原型。
- 让实际处境案例反向匹配卦爻，记录命中和误判。

通过条件：
- 至少 20 个现实处境案例能被映射到候选卦爻。
- 每个案例能给出 2-3 个候选，并说明为什么排除其他候选。

停止条件：
- 输出过度玄学化，无法转成行动边界。
- 用户只能得到泛泛安慰或模糊建议。

## 第 31-60 天

- 验证搜索入口和内容需求。
- 只公开 3-5 篇教育型页面，不公开完整资料搬运。
- 增加版权和免责声明。

通过条件：
- 出现真实搜索展示、收藏、复访、复制、反馈或问题提交。
- 至少 3 个外部用户认为样本帮助其澄清处境或行动边界。

停止条件：
- 只有内部兴趣，没有外部使用信号。
- 内容被误解为预测或高风险建议。

## 第 61-90 天

- 决定是否扩展到完整 64 卦。
- 若进入公开产品，只做教育型查询和处境辨析，不做保证结果。
- 若无外部信号，保留为内部知识库，用于训练 AgentSiteOps 路线图能力。

通过条件：
- 有稳定反馈、复访或可验证使用记录。
- 相似卦爻辨析成为核心差异化能力。

停止条件：
- 无搜索、无反馈、无复访、无可验证使用。
- 版权边界或误用风险无法控制。
`,
  "utf8"
);

console.log(
  JSON.stringify(
    {
      status: "ok",
      hexagrams: hexagramRows.length,
      lines: allLines.length,
      sampleLines: sampleLines.length,
      outputs: [
        "data/yijing-hexagram-index.csv",
        "data/yijing-sample-line-map.csv",
        "data/yijing-opportunity-scorecard.csv",
        "docs/yijing-route-pilot.md",
        "docs/yijing-route-research-brief.md",
        "docs/yijing-90-day-validation.md"
      ]
    },
    null,
    2
  )
);
