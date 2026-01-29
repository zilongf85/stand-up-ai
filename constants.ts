import { ComedianProfile } from './types';

export const PRESET_COMEDIANS: ComedianProfile[] = [
  {
    id: 'observational',
    name: '生活观察大师',
    styleDescription: '关注生活琐事细节。结构通常是“这到底是怎么回事...？”。逻辑清晰，质疑社会常规。',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'deprecating',
    name: '丧系自嘲风格',
    styleDescription: '低能量，专注于个人的失败、尴尬的社交互动，大量使用叹气和停顿。让观众产生共鸣的“倒霉蛋”人设。',
    avatarColor: 'bg-gray-600',
  },
  {
    id: 'angry',
    name: '愤怒咆哮型',
    styleDescription: '高能量，对愚蠢行为或社会现象感到愤怒。大声咆哮以强调观点。愤世嫉俗，攻击性强。',
    avatarColor: 'bg-red-600',
  },
  {
    id: 'absurdist',
    name: '荒诞/无厘头',
    styleDescription: '不按套路出牌，充满画面感的非逻辑梗，脑洞大开。通常配合冷面笑匠的表演方式。',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'custom',
    name: '自定义 / 模仿特定演员',
    styleDescription: '在下方输入脱口秀演员的名字，AI 将通过全网搜索学习其风格。',
    avatarColor: 'bg-emerald-600',
    isCustom: true
  }
];

export const INITIAL_KNOWLEDGE_PLACEHOLDER = `在此粘贴你的喜剧理论、特定演员的逐字稿或创作逻辑。
例如：
- 逻辑：“先抛出一个前提，进行铺垫，然后用一个误导性的反转作为梗。”
- 逐字稿：“那天我走进酒吧...” (AI 将模仿这种语调和用词习惯)。`;

export const KNOWLEDGE_PRESETS = [
  {
    label: "中文：传统铺垫-反转结构",
    content: `创作逻辑：
1. Setup (铺垫)：陈述一个大家公认的社会常识或个人经历，建立预期。
2. Connector (连接)：引导观众往一个方向思考。
3. Punchline (梗/反转)：突然打破预期，给出一个荒谬但又合理的解释。
4. Tag (追加梗)：在观众笑完后，再补一刀，强化笑点。

示例语感：
“你们发现没有，现在的人...”
“我就觉得特别离谱...”`
  },
  {
    label: "中文：谐音/内部梗风格",
    content: `创作逻辑：
1. 专注于汉语的双关语、谐音梗（扣钱梗）。
2. 喜欢引用成语但故意曲解。
3. 节奏轻快，甚至有点漫才的感觉。
4. 经常打破第四面墙，吐槽自己讲的段子很烂。`
  },
  {
    label: "英文：One-Liners (Zach Style)",
    content: `Style Guide (English One-liners):
1. Structure: Extremely short setup, immediate punchline.
2. Logic: Misdirection, non-sequitur, or wordplay.
3. Tone: Deadpan, low energy, awkward silence between jokes.
4. Example: "I haven't slept for ten days, because that would be too long."
5. No storytelling, just rapid-fire abstract jokes.`
  },
  {
    label: "英文：Storytelling (Mulaney Style)",
    content: `Style Guide (Storytelling):
1. Detailed narrative with distinct characters and voices.
2. Self-deprecating but polished high-energy delivery.
3. Specificity: Use exact brand names, specific times, and vivid descriptions.
4. Structure: "I was at this place..." -> "This weird thing happened..." -> "And I was like..." -> Call back to previous joke.`
  }
];
