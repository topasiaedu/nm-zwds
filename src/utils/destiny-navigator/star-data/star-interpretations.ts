/**
 * ZWDS Star Interpretation Data - Group 1: Power & Authority
 * Generated from master's teachings
 * DO NOT EDIT MANUALLY - regenerate if needed
 */

export interface StarData {
  name: string;
  chineseName: string;
  category: "major" | "minor";
  brightness: {
    bright: number;      // Multiplier when star is bright (favorable position)
    dim: number;         // Multiplier when star is dim (unfavorable position)
  };
  attributes: {
    authority: number;    // 0-100: Command, respect, leadership ability
    resources: number;    // 0-100: Material wealth, assets, accumulation
    strategy: number;     // 0-100: Planning, foresight, tactical thinking
    discipline: number;   // 0-100: Execution, consistency, follow-through
    flow: number;        // 0-100: Ease, natural momentum, effortlessness
  };
  keywords: string[];    // 5 actionable keywords
  essences: {
    life: string;        // 10-15 words, unique prose
    siblings: string;
    relationships: string;
    children: string;
    wealth: string;
    health: string;
    travel: string;
    social: string;
    career: string;
    home: string;
    fortune: string;
    parents: string;
  };
}

export const STAR_INTERPRETATIONS: Record<string, StarData> = {
  "紫微": {
    name: "Zi Wei",
    chineseName: "紫微",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 95,
      resources: 75,
      strategy: 85,
      discipline: 80,
      flow: 60
    },
    keywords: ["authority", "leadership", "premium", "hierarchy", "command"],
    essences: {
      life: "Naturally carry strong commanding energy, you don't wait for others to lead",
      siblings: "Command respect among peers, often the dominant one holding things together",
      relationships: "Attract strong independent partners, delayed marriage from powerful energy clash",
      children: "Raise disciplined bossy kids who want control, negotiate power not just guide",
      wealth: "Earn through career and competence, money follows responsibility and leadership roles",
      health: "Prone to rich-person illnesses from overdoing, stomach issues from stress and pressure",
      travel: "Prefer to travel alone or lead trips, stay in control outside comfort zones",
      social: "Attract high-quality connections, managers and CEOs who move with intention",
      career: "Shine in structured environments with hierarchy, trusted for roles with visibility",
      home: "One of strongest placements for real estate, secure long-term assets reflecting status",
      fortune: "Competitive ambitious mindset rarely shuts off, always thinking what's next",
      parents: "Strict structured upbringing with high expectations, needed to be responsible early"
    }
  },

  "廉贞": {
    name: "Lian Zhen",
    chineseName: "廉贞",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 70,
      resources: 65,
      strategy: 80,
      discipline: 90,
      flow: 50
    },
    keywords: ["discipline", "systems", "precision", "operations", "structure"],
    essences: {
      life: "Life path deeply tied to systems and routines, thrive on structure over popularity",
      siblings: "Reserved and slow to open up, not instantly warm with family members",
      relationships: "Cold or overly disciplined to others, strength is precision not emotional connection",
      children: "Structured parenting approach with clear rules, stability over spontaneous affection",
      wealth: "Build wealth brick by brick through admin operations and SOPs, solid financial system",
      health: "Watch blood circulation issues, monitor pressure and diet while staying moving",
      travel: "Prefer planned routine and familiar routes, not spontaneous or adventurous travelers",
      social: "Reserved slow to open up, maintain distance until trust is systematically built",
      career: "Excel in law planning tech agriculture, enforce rules deadlines with precision",
      home: "Grow step-by-step from small to medium to large, picky about cleanliness",
      fortune: "Mentally stable but risk over-rigidifying thinking, structure helps until it traps",
      parents: "Stable upbringing with clear rules, gave current backbone through systematic foundation"
    }
  },

  "天府": {
    name: "Tian Fu",
    chineseName: "天府",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 60,
      resources: 90,
      strategy: 75,
      discipline: 70,
      flow: 55
    },
    keywords: ["stability", "accumulation", "security", "conservation", "foundations"],
    essences: {
      life: "Calm measured structured energy, people feel safe when things go wrong",
      siblings: "Play elder role as stabilizer, supportive but powerful in family dynamics",
      relationships: "Traditional stable partners, prefer security before taking big relationship steps",
      children: "Nurturing steady parenting, provide emotional and material security for growth",
      wealth: "Don't chase fast money, prefer slow steady income through conservative moves",
      health: "Weak digestive system stomach spleen, eat too much when stressed or anxious",
      travel: "Shine in foreign markets, travel for growth not fun pays long-term",
      social: "Stick to same social circle, maintain long-term connections with trusted people",
      career: "Loyal worker suits real estate agriculture civil service, traditional stable paths",
      home: "Prefer completed homes or ready-made projects, value stability and familiar spaces",
      fortune: "Relax through routines and familiar places, find cleaning and organizing therapeutic",
      parents: "Traditional family upbringing, inherited values of security and long-term thinking"
    }
  },

  "天相": {
    name: "Tian Xiang",
    chineseName: "天相",
    category: "major",
    brightness: {
      bright: 1.25,
      dim: 0.75
    },
    attributes: {
      authority: 55,
      resources: 65,
      strategy: 75,
      discipline: 70,
      flow: 75
    },
    keywords: ["support", "diplomacy", "balance", "presentation", "trust"],
    essences: {
      life: "Naturally read the room, care about keeping things smooth polite and harmonious",
      siblings: "Diplomatic peacemaker among siblings, maintain balance and prevent family conflicts",
      relationships: "Grace and class in partnerships, attract through trust and calm stable energy",
      children: "Balanced fair parenting, teach children tact presentation and relationship skills",
      wealth: "Earn through trust and image, grow by being stable elegant and reliable",
      health: "Need balance and moderation, stress from maintaining harmony affects physical wellbeing",
      travel: "Follow where people go not spontaneous, prefer company over solo adventures",
      social: "Friendships tied to mutual benefit, carefully curated relationships with value exchange",
      career: "Work well behind scenes or public-facing, make sure everything runs smoothly",
      home: "Buy near familiar or home areas, don't move far from comfort zones",
      fortune: "Inner peace from balance and fairness, mental stability through diplomatic thinking",
      parents: "Very traditional upbringing, learned grace presentation and proper conduct early"
    }
  },

  "太阳": {
    name: "Tai Yang",
    chineseName: "太阳",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.6
    },
    attributes: {
      authority: 85,
      resources: 70,
      strategy: 70,
      discipline: 75,
      flow: 65
    },
    keywords: ["visibility", "presence", "generosity", "influence", "radiance"],
    essences: {
      life: "Born to stand out with presence, people look and remember your generous nature",
      siblings: "Radiant presence among siblings, naturally take visible leadership role in family",
      relationships: "Prideful in partnerships, need respect and recognition from romantic connections",
      children: "Strong parenting presence, children feel both pride and pressure from your expectations",
      wealth: "Earn through business hot markets visible roles, shine in mainstream industries",
      health: "Watch heart head and eyes, when collapse comes from overdoing not weakness",
      travel: "Shine brighter outside comfort zone, more alive respected and powerful when traveling",
      social: "Attract status-driven friends, generous with social circle who value achievement",
      career: "Built for big systems bold industries, law politics luxury energy sectors",
      home: "Prefer open bright spaces with good sunlight, may inherit property from father",
      fortune: "Hard to truly relax, mind always thinking what's next even when succeeding",
      parents: "Strong father presence, upbringing valued achievement respect and carrying family name"
    }
  },

  "太阴": {
    name: "Tai Yin",
    chineseName: "太阴",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.6
    },
    attributes: {
      authority: 50,
      resources: 85,
      strategy: 65,
      discipline: 60,
      flow: 80
    },
    keywords: ["attraction", "elegance", "passive-income", "emotional-intelligence", "refinement"],
    essences: {
      life: "Charming without trying, magnetic softness makes people notice your elegant grace",
      siblings: "Gentle nurturing presence in family, provide emotional support through soft power",
      relationships: "Attract naturally through beauty and emotion, risk love triangles or secret affairs",
      children: "Soft nurturing parenting, emotionally attuned to children's needs and feelings",
      wealth: "Money magnet through passive means, investments real estate beauty branding industries",
      health: "Prone to emotional eating and weight fluctuations, digestive issues from stress",
      travel: "Men attract women abroad, women shop when traveling to foreign places",
      social: "Many gossip-prone chatty friends, strong female circle with emotional connections",
      career: "Suited for finance beauty branding quiet leadership, attract through presence not force",
      home: "Multiple homes or inherit property, drawn to beautiful refined living spaces",
      fortune: "Lead by presence not force, subtle control through emotional intelligence and grace",
      parents: "Mother's influence is strong, soft power shapes values and emotional patterns"
    }
  },

  // Group 2: Action & Transformation (Agent 2)

  "武曲": {
    name: "Wu Qu",
    chineseName: "武曲",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 70,
      resources: 95,
      strategy: 75,
      discipline: 90,
      flow: 50
    },
    keywords: ["wealth", "precision", "discipline", "calculated", "execution"],
    essences: {
      life: "Born with calculator in head, everything measured strategic and connected to money",
      siblings: "Serious and practical among family, provide financial wisdom over emotional warmth",
      relationships: "Emotionally cold but financially hot, partner must accept your measured reserved nature",
      children: "Teach kids discipline and money management, practical parenting focused on building capability",
      wealth: "Best wealth placement, money finds you when staying consistent with tight numbers",
      health: "Strong constitution but watch metal element, precision in health monitoring prevents issues",
      travel: "Go out only for money not fun, built for foreign markets and overseas deals",
      social: "Attract wealthy capable friends, high-quality money circle who respect your systems",
      career: "Excel in finance metal production insurance, structured roles handling numbers and assets",
      home: "Money always finds way home, strong savings and long-term wealth accumulation",
      fortune: "Mentally clear and strategic, magnetic to cash when trusting your own system",
      parents: "Disciplined or strict upbringing, learned practical approach and financial responsibility early"
    }
  },

  "七杀": {
    name: "Qi Sha",
    chineseName: "七杀",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 75,
      resources: 60,
      strategy: 80,
      discipline: 85,
      flow: 45
    },
    keywords: ["speed", "courage", "action", "risk", "breakthrough"],
    essences: {
      life: "Think fast act fast, move before asking with high-risk high-reward mindset",
      siblings: "Competitive and intense with family, bond strengthens once everyone respects each other's power",
      relationships: "Fall fast marry fast with instant fire energy, power couple or power struggle",
      children: "Direct bold parenting, teach kids courage but must learn to soften approach",
      wealth: "Earn fast or lose fast with bold investments, need systems to tame speed",
      health: "Watch gut bones and injuries, body breaks from fighting energy and pressure",
      travel: "Spontaneous traveler who books now thinks later, thrive in action and movement",
      social: "Extremely social and quick to connect, network fast but relationships can be intense",
      career: "Shine in sales fighting industries crisis response, high-pressure fast-paced roles suit best",
      home: "Buy property on impulse, may regret location or rush renovations too fast",
      fortune: "Process emotions through action not reflection, breakthroughs come from allowing yourself seen",
      parents: "Strong family dynamic, either authoritative or hard to please shaped your courage"
    }
  },

  "破军": {
    name: "Po Jun",
    chineseName: "破军",
    category: "major",
    brightness: {
      bright: 1.25,
      dim: 0.75
    },
    attributes: {
      authority: 65,
      resources: 55,
      strategy: 60,
      discipline: 70,
      flow: 40
    },
    keywords: ["disruption", "rebuild", "transformation", "pioneering", "breakthrough"],
    essences: {
      life: "Intense aggressive forward energy, break then rebuild through chaos before clarity",
      siblings: "Distant in childhood but bond heals later, warmth comes after growing up",
      relationships: "Rebellious in love, argue and challenge but learn through crashing first",
      children: "Strong opinions from kids, they question authority just like you did growing up",
      wealth: "First business fails, succeed after few tries by starting again with pioneer spirit",
      health: "Strange inherited conditions or rare issues, body breaks first then rebuilds stronger",
      travel: "Always change destination impulsively, plans break easily but freedom matters most",
      social: "Know people for years but connection comes much later, deep bonds form slowly",
      career: "Excel in renovation logistics warehousing rough trades, rebuild roles suit best",
      home: "Refuse what's given, sell then buy again preferring freedom over inheritance",
      fortune: "Don't forget what people did, store emotions but grow through destructive breakthrough",
      parents: "Distant relationship in youth, bonds improve after marriage or when reaching adulthood"
    }
  },

  "贪狼": {
    name: "Tan Lang",
    chineseName: "贪狼",
    category: "major",
    brightness: {
      bright: 1.3,
      dim: 0.7
    },
    attributes: {
      authority: 60,
      resources: 70,
      strategy: 65,
      discipline: 50,
      flow: 85
    },
    keywords: ["charisma", "desire", "expression", "luxury", "branding"],
    essences: {
      life: "Born with big desires, expressive charming and emotionally rich with magnetic presence",
      siblings: "Stylish and performative in family, may compete for attention or spotlight",
      relationships: "Bold seductive energy in love, risk indulgence but chemistry runs deep",
      children: "Expressive parenting, teach kids confidence performance and how to shine naturally",
      wealth: "Earn through luxury performance beauty raw materials, your charm is your cashflow",
      health: "Desire can lead to excess, watch indulgent habits and need for control",
      travel: "Love shopping and pleasure trips, easily lose control when emotional abroad",
      social: "Social butterfly who connects widely, seek fun and expression over depth",
      career: "Shine in entertainment beauty teaching media luxury branding, you are the product",
      home: "Prefer luxury condos or stylish homes, drawn to beautiful spaces reflecting desires",
      fortune: "Channel desires into something bigger or burn out chasing trends and validation",
      parents: "Parents may be indulgent or value status appearance, shaped your expressive nature"
    }
  },

  "天机": {
    name: "Tian Ji",
    chineseName: "天机",
    category: "major",
    brightness: {
      bright: 1.25,
      dim: 0.75
    },
    attributes: {
      authority: 55,
      resources: 60,
      strategy: 90,
      discipline: 60,
      flow: 75
    },
    keywords: ["strategy", "intellect", "movement", "planning", "adaptability"],
    essences: {
      life: "Think fast move fast act on instinct, your brain processes everything at speed",
      siblings: "Talk and debate a lot with family, became independent competing for attention",
      relationships: "Experience few breakups before finding match, need mental stimulation over boring stability",
      children: "Raise sharp quick-witted kids, teach independence but expect them to question everything",
      wealth: "Money constantly in motion, earn and spend fast without system for savings",
      health: "Watch limbs and heart circulation, overactive mind makes body pay the price",
      travel: "Made for movement by any vehicle, love new environments and switching things up",
      social: "Attract same-age friends, exchange ideas and start random side projects together",
      career: "Excel in planning tech digital marketing teaching, shine where strategy is needed",
      home: "Prefer smaller practical ready-made spaces, efficiency and convenience over luxury",
      fortune: "Peace comes from clarity not silence, get thoughts in order to calm everything",
      parents: "Encouraged to learn explore, moved houses or schools young teaching you adaptability"
    }
  },

  "巨门": {
    name: "Ju Men",
    chineseName: "巨门",
    category: "major",
    brightness: {
      bright: 1.25,
      dim: 0.75
    },
    attributes: {
      authority: 70,
      resources: 65,
      strategy: 85,
      discipline: 75,
      flow: 55
    },
    keywords: ["persuasion", "communication", "secrets", "depth", "influence"],
    essences: {
      life: "Born observant with sharp words, talk to understand protect or influence situations",
      siblings: "Quiet or guarded with family, communicate carefully maintaining some emotional distance",
      relationships: "Something hidden in partnerships, skeptical nature creates complex emotional layers",
      children: "Teach kids to speak with frameworks not emotions, logical structured communication approach",
      wealth: "Make money using your mouth, speaking teaching negotiating selling advising pays well",
      health: "Watch mouth stomach and internal organs, stress shows up in digestive system",
      travel: "Prefer solitude or secret retreats, don't announce where you're going enjoy privacy",
      social: "Keep friends private, social circle not easily revealed to others maintaining boundaries",
      career: "Excel in law politics media psychology, anything involving persuasive words and depth",
      home: "Sensitive to environment, prefer dim lighting quiet zones near religious sites or water",
      fortune: "Struggle with inner doubt and overthinking, become master communicator once finding clarity",
      parents: "Relationship may feel unclear or emotionally guarded, learned to read what's unsaid"
    }
  },

  // Group 3: Harmony & Support (Agent 3)

  "天同": {
    name: "Tian Tong",
    chineseName: "天同",
    category: "major",
    brightness: {
      bright: 1.2,
      dim: 0.8
    },
    attributes: {
      authority: 40,
      resources: 60,
      strategy: 50,
      discipline: 30,
      flow: 95
    },
    keywords: ["harmony", "childlike", "peace", "ease", "blessing"],
    essences: {
      life: "Carry childlike presence, people find you gentle relaxed maybe a little too soft",
      siblings: "Peacekeeper in the family, caring connection not competitive even when you argue",
      relationships: "Partner is gentle emotionally present, both avoid tough conversations unless forced to",
      children: "Kids are expressive emotionally deep imaginative, manage their ups and downs with yours",
      wealth: "Not aggressive chasing money, need clear goals or you coast through life aimlessly",
      health: "Emotional health governs body, stress fatigue digestive issues tied to how you feel",
      travel: "Come alive when traveling, prefer relaxed joyful trips but learn most outside comfort",
      social: "Friend circle includes younger people or playful relaxed energy, choose wisely not many",
      career: "Excel in childcare hospitality healing admin, need supportive gentle-paced emotionally balanced roles",
      home: "Love homes that feel like resorts, care about vibe not size with cozy luxurious features",
      fortune: "Emotional state fluctuates fast, practice anchoring and avoid numbing through comfort food",
      parents: "Protected upbringing with emotional cushioning, taught to avoid conflict now struggle with pressure"
    }
  },

  "天梁": {
    name: "Tian Liang",
    chineseName: "天梁",
    category: "major",
    brightness: {
      bright: 1.25,
      dim: 0.75
    },
    attributes: {
      authority: 65,
      resources: 70,
      strategy: 80,
      discipline: 75,
      flow: 70
    },
    keywords: ["wisdom", "protection", "longevity", "service", "legacy"],
    essences: {
      life: "Old soul who thinks twice before moving, people listen even when you're not number one",
      siblings: "Play elder stabilizer role even if not eldest, supportive but powerful in family dynamics",
      relationships: "Attract older mature partners, build trust not chase romance through safe emotional intelligence",
      children: "Kids act mature beyond age, sharp deep thinkers sometimes smarter than you in areas",
      wealth: "Build wealth by serving through consulting helping healing, monetize experience not fast money",
      health: "Illness lingers when it comes, watch rheumatism arthritis chronic fatigue through prevention first",
      travel: "Go to same places repeatedly for familiarity, sit hours at café drinking tea in peace",
      social: "Cross-generation friendships with older and younger people, value depth over similarity in age",
      career: "Thrive guiding mentoring protecting people, trusted director not aggressive CEO who does things right",
      home: "Buy what you can see touch confirm, prefer pre-built second-hand or proven properties",
      fortune: "Find peace in old things like tea antiques books history, rich reflective inner world",
      parents: "Father lives long or leaves strong legacy, traditional upbringing shaped by moral cultural values"
    }
  },

  "文昌": {
    name: "Wen Chang",
    chineseName: "文昌",
    category: "minor",
    brightness: {
      bright: 1.2,
      dim: 0.8
    },
    attributes: {
      authority: 45,
      resources: 55,
      strategy: 75,
      discipline: 65,
      flow: 60
    },
    keywords: ["intellect", "structure", "logic", "teaching", "documentation"],
    essences: {
      life: "Naturally cerebral thinker, observe before acting and mentally organize chaos into clear systems",
      siblings: "Bond over study work shared responsibilities, rational dynamic more than emotional warmth",
      relationships: "Attracted to intelligent partners for deep conversations, over-analyze feelings into coldness if not careful",
      children: "Kids are bright curious excel in structured learning, don't project academic pressure onto them",
      wealth: "Earn through teaching coaching content creation copywriting, brain work over physical hustle always",
      health: "Overthinking creates stress and health issues, digestion tension headaches insomnia from mental looping",
      travel: "Planner friend who researches reviews lists compares, culture trips with itinerary not random backpacking",
      social: "Prefer deep conversation over casual hangouts, bond over ideas attracting thinkers not hype",
      career: "Shine in research strategy academic planning content editorial, clean organized logic for any company",
      home: "Like organized efficient homes where everything has place, functional design creates mentally peaceful space",
      fortune: "Don't do well in chaos, create systems rituals clear decisions for calmer structured energy",
      parents: "Raised with structure expectations emphasis on learning, shaped your high standards for yourself and others"
    }
  },

  "文曲": {
    name: "Wen Qu",
    chineseName: "文曲",
    category: "minor",
    brightness: {
      bright: 1.2,
      dim: 0.8
    },
    attributes: {
      authority: 45,
      resources: 55,
      strategy: 70,
      discipline: 60,
      flow: 70
    },
    keywords: ["expression", "articulation", "creativity", "communication", "artistry"],
    essences: {
      life: "Sharp articulate expressive thinker, understand first then express with artistic delivery and precision",
      siblings: "Academically inclined family dynamic, high expectations placed on everyone in the household",
      relationships: "Want clarity logic emotional stability in partners, let yourself feel not just think everything through",
      children: "Bright curious kids who excel learning, remember not all intelligence comes from books alone",
      wealth: "Make money teaching writing coaching communicating clearly, turn knowledge into income streams that scale",
      health: "Body reacts to brain overdrive, watch digestion tension and insomnia from constant mental activity",
      travel: "Love traveling with goal to learn attend events, prefer culture trips over spontaneous wandering",
      social: "Attract thinkers who bond over ideas, may seem too serious but that's your natural vibe",
      career: "Excel in teaching editing copywriting curriculum content marketing, expressive artistic delivery meets structure",
      home: "Need organized clean minimalist spaces, label storage arrange books by theme for mental peace",
      fortune: "Need logic to feel safe, spiral mentally when life doesn't make sense so write priorities down",
      parents: "Disciplined education-focused upbringing with tuition and high standards, finish homework before you eat"
    }
  },

  "左辅": {
    name: "Zuo Fu",
    chineseName: "左辅",
    category: "minor",
    brightness: {
      bright: 1.15,
      dim: 0.85
    },
    attributes: {
      authority: 35,
      resources: 50,
      strategy: 60,
      discipline: 70,
      flow: 75
    },
    keywords: ["support", "amplifier", "loyalty", "helper", "backing"],
    essences: {
      life: "Life feels supported, others help you grow stabilize even when you're confused or lost",
      siblings: "Strong emotional backing from family, never truly alone in sibling dynamics and connections",
      relationships: "Marriage gains strength through loyalty shared responsibilities, partnership amplifies your natural energy",
      children: "Kids are dependable and assist back when grown, support flows both ways through generations",
      wealth: "Attract money through others' trust and support, boost earning not by being loudest but most reliable",
      health: "Recover faster from illness when support present, body responds well to helping hands around you",
      travel: "Always find helping hands during trips, rarely stranded because support shows up just in time",
      social: "Strong network of allies who help in crucial times, turning point people appear behind scenes",
      career: "Won't climb alone, team mentors boss system push you upward through amplified collective energy",
      home: "Easier to own property with family or external support, backing appears for real estate moves",
      fortune: "Support comes subtly or obviously to nudge you forward, never fully lost even in confusion",
      parents: "Protected upbringing where parents or elders provide extra guidance, safety net from start"
    }
  },

  "右弼": {
    name: "You Bi",
    chineseName: "右弼",
    category: "minor",
    brightness: {
      bright: 1.15,
      dim: 0.85
    },
    attributes: {
      authority: 35,
      resources: 50,
      strategy: 60,
      discipline: 70,
      flow: 75
    },
    keywords: ["assistance", "noble-person", "trust", "collaboration", "protection"],
    essences: {
      life: "Never fully alone, support appears to amplify your energy even without major stars present",
      siblings: "Family provides emotional backing, stabilizing presence that strengthens bonds over time through loyalty",
      relationships: "Partnership built on shared responsibilities trust, loyalty amplifies what both of you bring naturally",
      children: "Dependable children who help back later, support flows in both directions as they mature",
      wealth: "Doubles power of money-making efforts, others trust and support your work not your noise",
      health: "Body responds to support around you, someone drives helps you recover lends hand when needed",
      travel: "Find helping hands on trips, safety net appears when you need it most far from home",
      social: "Network of trusted allies amplify behind scenes, mentor partner sibling or stranger becomes turning point",
      career: "Team boss system helps push upward, gain support climbing through loyal long-term collaboration",
      home: "Property comes easier with backing, family or external support makes real estate moves smoother",
      fortune: "Look at who amplifies your life behind scenes, sometimes that's what makes all the difference",
      parents: "Extra guidance from elders shapes you, protected start gives foundation for supported life path"
    }
  }
};

// Validation: Total star count
export const TOTAL_STARS = Object.keys(STAR_INTERPRETATIONS).length;
if (TOTAL_STARS !== 18) {
  throw new Error(`Expected 18 stars, got ${TOTAL_STARS}`);
}
