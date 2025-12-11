/**
 * Wealth Code Mapping Constants
 * Maps ZWDS stars to their wealth-building archetypes and career paths
 * Based on teaching slides and speaker script
 */

/**
 * Wealth Code Type Keys
 */
export type WealthCodeKey = "investmentBrain" | "brandingMagnet" | "strategyPlanner" | "collaborator";

/**
 * Individual wealth code score contribution
 */
export interface WealthCodeScore {
  key: WealthCodeKey;
  label: string;
  score: number; // 0-10 scale
}

/**
 * Career recommendation with reason
 */
export interface CareerRecommendation {
  role: string;
  reason: string;
}

/**
 * Complete star wealth profile
 */
export interface StarWealthData {
  chineseName: string;
  englishName: string;
  primaryWealthCode: WealthCodeKey;
  scores: WealthCodeScore[];
  moneyMakingPath: string;
  asEmployee: string;
  asBoss: string;
  idealCareers: CareerRecommendation[];
  nonIdealCareers: CareerRecommendation[];
  shortNote: string;
}

/**
 * Wealth code labels and descriptions
 */
export const WEALTH_CODE_LABELS: Record<WealthCodeKey, string> = {
  investmentBrain: "Investment Brain",
  brandingMagnet: "Branding Magnet",
  strategyPlanner: "Strategy Planner",
  collaborator: "Collaborator",
};

export const WEALTH_CODE_SHORT_LABELS: Record<WealthCodeKey, string> = {
  investmentBrain: "IB",
  brandingMagnet: "BM",
  strategyPlanner: "SP",
  collaborator: "CO",
};

export const WEALTH_CODE_DESCRIPTIONS: Record<WealthCodeKey, string> = {
  investmentBrain: "For those who win by logic, long-term planning, and capital efficiency.",
  brandingMagnet: "For those who monetize visibility, charisma, and social attention.",
  strategyPlanner: "For those who build long-term wealth through systems, foresight, and structured power.",
  collaborator: "Loyal, emotionally intelligent, relationship-based. You win through deep trust and team power.",
};

/**
 * Complete star wealth code mapping
 * English names match the star names in ChartData
 */
export const STAR_WEALTH_CODE_MAP: Record<string, StarWealthData> = {
  // ===== STRATEGY PLANNER STARS =====
  "紫微": {
    chineseName: "紫微",
    englishName: "Zi Wei",
    primaryWealthCode: "strategyPlanner",
    scores: [
      { key: "strategyPlanner", label: "Strategy Planner", score: 9.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 6.5 },
      { key: "collaborator", label: "Collaborator", score: 5.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 4.5 },
    ],
    moneyMakingPath: "Power + Prestige — CEO, public sector, high-end industries",
    asEmployee: "Suits management, luxury brands, leadership roles",
    asBoss: "Builds high-trust biz — consulting, jewelry, gov-linked",
    idealCareers: [
      { role: "CEO / Founder", reason: "Natural leadership presence and strategic vision for building premium businesses" },
      { role: "Management Consultant", reason: "High-level decision making and authority in professional services" },
      { role: "Public Official", reason: "Thrives in government roles requiring structure and respect" },
      { role: "Luxury Brand Manager", reason: "Manages elite teams and holds premium standards" },
      { role: "Strategy Director", reason: "Leadership aura and ability to move entire strategy forward" },
    ],
    nonIdealCareers: [
      { role: "Cashier / Retail Associate", reason: "Too small and chaotic for your leadership energy" },
      { role: "Data Entry Clerk", reason: "No authority or team to lead, beneath your capability" },
      { role: "Basic Admin Assistant", reason: "Your strategic mind needs complex challenges, not repetitive tasks" },
    ],
    shortNote: "Leadership presence and systematic thinking for long-term empire building",
  },

  "廉贞": {
    chineseName: "廉贞",
    englishName: "Lian Zhen",
    primaryWealthCode: "strategyPlanner",
    scores: [
      { key: "strategyPlanner", label: "Strategy Planner", score: 8.5 },
      { key: "collaborator", label: "Collaborator", score: 7.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Structure + SOP — admin, HR, operations",
    asEmployee: "Fits backend ops, planning, online systems",
    asBoss: "Builds SOP biz — agencies, HR firms, system teams",
    idealCareers: [
      { role: "Operations Manager", reason: "Thrives organizing backend systems and creating efficient workflows" },
      { role: "HR Director", reason: "Excels at building clear SOPs and managing team structures" },
      { role: "Project Manager", reason: "Strong at step-by-step planning with defined responsibilities" },
      { role: "Systems Administrator", reason: "Turns chaos into structure through systematic processes" },
      { role: "Agency Operations Lead", reason: "Ensures everything runs on time and budget with no chaos" },
    ],
    nonIdealCareers: [
      { role: "Startup Founder (No System)", reason: "Vague, messy environments with no structure will drive you crazy" },
      { role: "Freelance Creative", reason: "Too unstructured and unpredictable for your SOP-driven mind" },
      { role: "Fast-Paced Sales Floor", reason: "Prefers clear processes over last-minute chaos" },
    ],
    shortNote: "Backend efficiency expert who transforms chaos into scalable systems",
  },

  "天机": {
    chineseName: "天机",
    englishName: "Tian Ji",
    primaryWealthCode: "strategyPlanner",
    scores: [
      { key: "strategyPlanner", label: "Strategy Planner", score: 9.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 6.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.0 },
      { key: "collaborator", label: "Collaborator", score: 4.5 },
    ],
    moneyMakingPath: "Brain + Ideas — research, design, strategy",
    asEmployee: "Suits R&D, branding, creative roles",
    asBoss: "Builds idea-based biz — coaching, tech, frameworks",
    idealCareers: [
      { role: "Brand Strategist", reason: "Your insight and planning ability creates winning market positioning" },
      { role: "R&D Director", reason: "Space to think deeply and design innovative solutions" },
      { role: "Creative Director", reason: "Combines strategic thinking with creative frameworks" },
      { role: "Tech Product Designer", reason: "Builds tools and systems others use to grow" },
      { role: "Strategy Consultant", reason: "Provides the smarter way to do things through frameworks" },
    ],
    nonIdealCareers: [
      { role: "Assembly Line Worker", reason: "Your brain needs thinking space, not just repetitive action" },
      { role: "Manual Labor", reason: "All body, no brain — wastes your strategic gift" },
      { role: "Telemarketing Script Reader", reason: "No space for your ideas or strategic input" },
    ],
    shortNote: "Strategic mind that outthinks rather than outhustles for wealth creation",
  },

  "天梁": {
    chineseName: "天梁",
    englishName: "Tian Liang",
    primaryWealthCode: "strategyPlanner",
    scores: [
      { key: "strategyPlanner", label: "Strategy Planner", score: 8.0 },
      { key: "collaborator", label: "Collaborator", score: 7.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 6.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Wisdom + Care — long-term, service-based industries",
    asEmployee: "Fits government, healthcare, stocks, wellness",
    asBoss: "Builds stable biz — healing, insurance, guidance",
    idealCareers: [
      { role: "Financial Advisor", reason: "Long-term planning and trusted guidance for client wealth" },
      { role: "Civil Service Officer", reason: "Stable, structured environment for purposeful work" },
      { role: "Healthcare Administrator", reason: "Provides care and stability in healing industries" },
      { role: "Stock Planner", reason: "Long-term perspective and disciplined strategy for investments" },
      { role: "Wellness Coach", reason: "Builds trust-based relationships that last for years" },
    ],
    nonIdealCareers: [
      { role: "Day Trader", reason: "Requires quick, instinctive decisions rather than long-term wisdom" },
      { role: "Fast Money Schemes", reason: "You're built for lasting legacy, not get-rich-quick gambles" },
      { role: "High-Pressure Sales", reason: "Pushy tactics conflict with your trust-building approach" },
    ],
    shortNote: "Wise advisor energy that builds trust-based wealth over decades",
  },

  // ===== INVESTMENT BRAIN STARS =====
  "武曲": {
    chineseName: "武曲",
    englishName: "Wu Qu",
    primaryWealthCode: "investmentBrain",
    scores: [
      { key: "investmentBrain", label: "Investment Brain", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.0 },
      { key: "collaborator", label: "Collaborator", score: 4.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 3.5 },
    ],
    moneyMakingPath: "Numbers + Structure — finance, auditing, metal-related industries",
    asEmployee: "Strong in roles like accountant, finance analyst, risk control",
    asBoss: "Builds cash flow-based business — trading, loan ops, investment platform",
    idealCareers: [
      { role: "CFO / Finance Director", reason: "Natural money instinct and tight control over cashflow" },
      { role: "Accountant / Auditor", reason: "Disciplined with numbers and spots money leaks before others notice" },
      { role: "Risk Manager", reason: "Knows when to walk away and when something's worth it" },
      { role: "Logistics Manager", reason: "Controls structure and budget without needing to do delivery" },
      { role: "Investment Analyst", reason: "Results-oriented approach to evaluating financial opportunities" },
    ],
    nonIdealCareers: [
      { role: "Event Entertainer", reason: "Requires flashy performance, not your serious execution style" },
      { role: "Motivational Speaker", reason: "You believe in plans that work, not empty manifestation talk" },
      { role: "Social Media Influencer", reason: "Too much talk, not enough tangible results for your taste" },
    ],
    shortNote: "Financial discipline and money instinct for structured wealth accumulation",
  },

  "天府": {
    chineseName: "天府",
    englishName: "Tian Fu",
    primaryWealthCode: "investmentBrain",
    scores: [
      { key: "investmentBrain", label: "Investment Brain", score: 8.5 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 7.0 },
      { key: "collaborator", label: "Collaborator", score: 6.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Assets + Stability — property, logistics, and long-term careers",
    asEmployee: "Suits civil service, property sales, or admin-based work",
    asBoss: "Runs real estate team, logistics biz, or structured MLM business",
    idealCareers: [
      { role: "Property Investor", reason: "Slow and steady asset accumulation is your natural path" },
      { role: "Civil Servant", reason: "Clear SOPs, fixed income, and long-term stability suit you" },
      { role: "Logistics Director", reason: "Building systems that run long-term even when you're not around" },
      { role: "Real Estate Agent", reason: "Asset-based industry with structured plans and growth" },
      { role: "Operations Manager", reason: "Process-driven work where you build foundations" },
    ],
    nonIdealCareers: [
      { role: "Crypto Day Trader", reason: "Fast money and big risks conflict with your stable nature" },
      { role: "Startup Hustler", reason: "You need clear systems, not chaotic experimentation" },
      { role: "High-Risk Speculator", reason: "Your wealth comes from holding assets, not gambling on volatility" },
    ],
    shortNote: "Asset builder who stacks wealth slowly through stability and structure",
  },

  "太阴": {
    chineseName: "太阴",
    englishName: "Tai Yin",
    primaryWealthCode: "investmentBrain",
    scores: [
      { key: "investmentBrain", label: "Investment Brain", score: 8.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 7.0 },
      { key: "collaborator", label: "Collaborator", score: 6.5 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 5.0 },
    ],
    moneyMakingPath: "Emotion + Cashflow Driven — beauty, wellness, property",
    asEmployee: "Fits roles in skincare, travel, feminine retails, real estate",
    asBoss: "Builds soft-power biz — beauty, retreats, rental property, women-led brands",
    idealCareers: [
      { role: "Beauty Business Owner", reason: "Soft power attracts loyal female customers through emotion" },
      { role: "Wellness Center Manager", reason: "Creates calm environments where trust and care drive income" },
      { role: "Property Rental Manager", reason: "Long-term cashflow through emotional connection and service" },
      { role: "Boutique Travel Agent", reason: "Makes people feel safe and special, leading to repeat bookings" },
      { role: "Skincare Brand Founder", reason: "Builds relationship-based business in female market" },
    ],
    nonIdealCareers: [
      { role: "Aggressive Sales Closer", reason: "You attract through softness, not force or pressure" },
      { role: "High-Pressure Trading Floor", reason: "Loud and fast-paced chaos drains your gentle energy" },
      { role: "Construction Foreman", reason: "Too rough and direct for your nurturing approach" },
    ],
    shortNote: "Soft power that turns care, connection, and property into steady cashflow",
  },

  // ===== BRANDING MAGNET STARS =====
  "贪狼": {
    chineseName: "贪狼",
    englishName: "Tan Lang",
    primaryWealthCode: "brandingMagnet",
    scores: [
      { key: "brandingMagnet", label: "Branding Magnet", score: 9.5 },
      { key: "collaborator", label: "Collaborator", score: 6.5 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 5.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 4.5 },
    ],
    moneyMakingPath: "Charm + Expression — luxury sales, metaphysics, performing, hosting",
    asEmployee: "Shines in luxury retail, event work, metaphysical services, influencer marketing",
    asBoss: "Builds vibe-based brands — personal brand, metaphysical biz, premium service offers",
    idealCareers: [
      { role: "Luxury Sales Consultant", reason: "Your charm and energy close deals without hard selling" },
      { role: "Feng Shui Consultant", reason: "People book you for your vibe, not just the advice" },
      { role: "Event Emcee / Host", reason: "You are the product — your presence is the brand" },
      { role: "Influencer / KOL", reason: "Your magnetic personality naturally attracts opportunities" },
      { role: "High-End Service Provider", reason: "Client-facing roles where your charm becomes the marketing" },
    ],
    nonIdealCareers: [
      { role: "Backend Operations", reason: "You need to be seen and expressive, not hidden in systems" },
      { role: "Data Entry", reason: "Boring, repetitive work kills your creative and social energy" },
    ],
    shortNote: "Natural charisma that makes you the vibe people pay for",
  },

  "巨门": {
    chineseName: "巨门",
    englishName: "Ju Men",
    primaryWealthCode: "brandingMagnet",
    scores: [
      { key: "brandingMagnet", label: "Branding Magnet", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.5 },
      { key: "collaborator", label: "Collaborator", score: 6.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 4.0 },
    ],
    moneyMakingPath: "Speaking + Trust — webinars, coaching, sales, education",
    asEmployee: "Shines as closer, coach, webinar host, lawyer, or trust-based sales",
    asBoss: "Builds talk-based brands — online programs, speaking, coaching frameworks",
    idealCareers: [
      { role: "Webinar Closer", reason: "Your clear explanation without hype makes people nod and buy" },
      { role: "Coach / Trainer", reason: "Logic and structure in your words create trust and conversion" },
      { role: "Lawyer", reason: "Your mouth is your weapon — you convince through calm clarity" },
      { role: "Sales Trainer", reason: "You teach others to talk properly and close with trust" },
      { role: "Online Educator", reason: "No dancing or hype needed — your words do the selling" },
    ],
    nonIdealCareers: [
      { role: "Branding-Only Role", reason: "You need to speak and explain, not just look good" },
      { role: "Programmer", reason: "Your gift is communication, not silent code-writing" },
    ],
    shortNote: "Master communicator who sells by talking right, not talking more",
  },

  "太阳": {
    chineseName: "太阳",
    englishName: "Tai Yang",
    primaryWealthCode: "brandingMagnet",
    scores: [
      { key: "brandingMagnet", label: "Branding Magnet", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 7.0 },
      { key: "collaborator", label: "Collaborator", score: 5.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 4.5 },
    ],
    moneyMakingPath: "Visibility + Influence — law, politics, trending brands, energy sector",
    asEmployee: "Fits branding, PR, legal, government-linked or high-status industries",
    asBoss: "Builds impact-driven business — law firm, public brand, leadership platform",
    idealCareers: [
      { role: "PR Director", reason: "Natural authority and presence that commands respect" },
      { role: "Lawyer", reason: "Leadership and public-facing roles where status matters" },
      { role: "Brand Ambassador", reason: "People trust and follow you just by showing up" },
      { role: "Political Leader", reason: "Leads from the front with visibility and influence" },
      { role: "Energy Sector Executive", reason: "High-impact industries where you're seen as No.1" },
    ],
    nonIdealCareers: [
      { role: "Admin Clerk", reason: "You're made to lead, not hide in behind-the-scenes tasks" },
      { role: "Behind-the-Scenes Tech", reason: "Your power comes from being visible, not hidden" },
    ],
    shortNote: "Natural leader whose presence and authority pull people in automatically",
  },

  "七杀": {
    chineseName: "七杀",
    englishName: "Qi Sha",
    primaryWealthCode: "brandingMagnet",
    scores: [
      { key: "brandingMagnet", label: "Branding Magnet", score: 8.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 6.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 5.5 },
      { key: "collaborator", label: "Collaborator", score: 4.0 },
    ],
    moneyMakingPath: "Action + Risk — military, police, surgery, rescue, trading",
    asEmployee: "Shines in army, police, surgery, trading, or crisis-response roles",
    asBoss: "Builds fast-action businesses — security firms, ops teams, trading houses",
    idealCareers: [
      { role: "Crisis Trader", reason: "Performs best under pressure with sharp decision-making" },
      { role: "Surgeon", reason: "Calm under pressure, cuts clean when others panic" },
      { role: "Police / Army Officer", reason: "High-risk, high-reward environment suits your intensity" },
      { role: "Security Firm Owner", reason: "Fast action and bold moves in professional enforcement" },
      { role: "Emergency Response Lead", reason: "You get in, settle the task, and move on efficiently" },
    ],
    nonIdealCareers: [
      { role: "Desk Job", reason: "Too slow and boring for your action-oriented nature" },
      { role: "Slow Planner", reason: "You move first and adjust later — meetings drain you" },
    ],
    shortNote: "Bold enforcer who acts fast with calculated precision under pressure",
  },

  "破军": {
    chineseName: "破军",
    englishName: "Po Jun",
    primaryWealthCode: "brandingMagnet",
    scores: [
      { key: "brandingMagnet", label: "Branding Magnet", score: 8.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      { key: "collaborator", label: "Collaborator", score: 5.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 4.5 },
    ],
    moneyMakingPath: "Rebuild + Hands-On — renovation, logistics, warehouse, delivery",
    asEmployee: "Shines in warehouse ops, renovation crew, delivery rider, construction",
    asBoss: "Builds physical businesses — renovation teams, container/lorry biz, hardware",
    idealCareers: [
      { role: "Renovation Contractor", reason: "Smash old walls and rebuild better, stronger, more valuable" },
      { role: "Logistics Boss", reason: "Hands dirty but every delivery earns solid cash" },
      { role: "Warehouse Manager", reason: "Likes doing and fixing things yourself from scratch" },
      { role: "Delivery Service Owner", reason: "Movement, structure, and rebuilding generates income" },
      { role: "Heavy Construction Lead", reason: "Gritty, physical, practical work with real results" },
    ],
    nonIdealCareers: [
      { role: "Office Politics Role", reason: "You need to move and build, not sit and strategize" },
      { role: "Soft Sales", reason: "Your power is in action and rebuilding, not gentle persuasion" },
    ],
    shortNote: "Rebel rebuilder who transforms chaos into stronger foundations through action",
  },

  // ===== COLLABORATOR STARS =====
  "天同": {
    chineseName: "天同",
    englishName: "Tian Tong",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 9.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 6.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 5.0 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.5 },
    ],
    moneyMakingPath: "Peace + Comfort — wellness, F&B, lifestyle, customer care",
    asEmployee: "Fits hospitality, service desk, wellness, food, retail",
    asBoss: "Builds chill, people-first business — cafes, boutique brands, community spaces",
    idealCareers: [
      { role: "Café Owner", reason: "Nothing flashy but people return for the calm, real vibe" },
      { role: "Wellness Reception", reason: "Gentle presence makes clients feel at ease naturally" },
      { role: "Customer Service Lead", reason: "Handles difficult clients calmly and smoothly" },
      { role: "Boutique Retail", reason: "Low-pressure environment with loyal regulars" },
      { role: "Health Product Seller", reason: "Consistent and gentle approach builds trust without hard-selling" },
    ],
    nonIdealCareers: [
      { role: "High-Pressure Sales", reason: "You don't chase — you let good energy attract naturally" },
      { role: "Competitive Corporate", reason: "Fighting and competing drains your peaceful nature" },
      { role: "Aggressive Trading", reason: "Your income flows where comfort grows, not through stress" },
    ],
    shortNote: "Peaceful presence that creates comfortable spaces where money flows naturally",
  },

  "天相": {
    chineseName: "天相",
    englishName: "Tian Xiang",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 8.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 7.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.0 },
    ],
    moneyMakingPath: "Grace + Trust — HR, insurance, PR, beauty, relationship-based",
    asEmployee: "Shines in HR, public relations, image consultant, insurance",
    asBoss: "Builds trust-based businesses — insurance teams, beauty, event companies",
    idealCareers: [
      { role: "HR Director", reason: "Smooths tension and handles people with diplomatic grace" },
      { role: "Insurance Advisor", reason: "People refer you repeatedly for your elegant stability" },
      { role: "PR Consultant", reason: "Polished presence earns trust and represents brands well" },
      { role: "Image Consultant", reason: "Class and composure make you the stable choice for partnerships" },
      { role: "Event Manager", reason: "Collaborative approach attracts clients through trust, not force" },
    ],
    nonIdealCareers: [
      { role: "Warehouse Labor", reason: "Your strength is grace and presentation, not physical work" },
      { role: "Aggressive Closer", reason: "You earn through elegance, not pressure tactics" },
      { role: "Chaotic Startup", reason: "You need stable partnerships, not messy experimentation" },
    ],
    shortNote: "Diplomatic grace that builds wealth through trust and refined partnerships",
  },

  "左辅": {
    chineseName: "左辅",
    englishName: "Zuo Fu",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Support + Loyalty — EA, PA, operations coordinator, long-term projects",
    asEmployee: "Shines as EA, backend manager, operations coordinator, admin lead",
    asBoss: "Builds through integrity and solid partnership — team-based, long-term alliances",
    idealCareers: [
      { role: "Executive Assistant", reason: "The right-hand everyone trusts to hold things together" },
      { role: "Operations Coordinator", reason: "Quietly makes everything work even when chaos strikes" },
      { role: "Project Manager", reason: "Provides long-term commitment and patient support" },
      { role: "Backend Support Lead", reason: "You're the anchor people can't do without" },
      { role: "Chief of Staff", reason: "Loyalty and detail-orientation make you indispensable" },
    ],
    nonIdealCareers: [
      { role: "Solo Influencer", reason: "You're built to support teams, not be the face" },
      { role: "Independent Freelancer", reason: "Your strength comes from collaboration, not isolation" },
      { role: "Spotlight Performer", reason: "You shine behind the scenes, not in front of the camera" },
    ],
    shortNote: "Ultimate support pillar that holds teams steady through loyalty and consistency",
  },

  // Traditional character variant (used in calculator.ts)
  "左輔": {
    chineseName: "左輔",
    englishName: "Zuo Fu",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Support + Loyalty — EA, PA, operations coordinator, long-term projects",
    asEmployee: "Shines as EA, backend manager, operations coordinator, admin lead",
    asBoss: "Builds through integrity and solid partnership — team-based, long-term alliances",
    idealCareers: [
      { role: "Executive Assistant", reason: "The right-hand everyone trusts to hold things together" },
      { role: "Operations Coordinator", reason: "Quietly makes everything work even when chaos strikes" },
      { role: "Project Manager", reason: "Provides long-term commitment and patient support" },
      { role: "Backend Support Lead", reason: "You're the anchor people can't do without" },
      { role: "Chief of Staff", reason: "Loyalty and detail-orientation make you indispensable" },
    ],
    nonIdealCareers: [
      { role: "Solo Influencer", reason: "You're built to support teams, not be the face" },
      { role: "Independent Freelancer", reason: "Your strength comes from collaboration, not isolation" },
      { role: "Spotlight Performer", reason: "You shine behind the scenes, not in front of the camera" },
    ],
    shortNote: "Ultimate support pillar that holds teams steady through loyalty and consistency",
  },

  "右弼": {
    chineseName: "右弼",
    englishName: "You Bi",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 9.0 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 6.5 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 4.0 },
    ],
    moneyMakingPath: "Support + Loyalty — EA, PA, operations coordinator, long-term projects",
    asEmployee: "Shines as EA, backend manager, operations coordinator, admin lead",
    asBoss: "Builds through integrity and solid partnership — team-based, long-term alliances",
    idealCareers: [
      { role: "Personal Assistant", reason: "Never misses a detail and keeps everything running smoothly" },
      { role: "Operations Manager", reason: "Quietly ensures the team stays steady when things fall apart" },
      { role: "Administrative Director", reason: "Long-term commitment and patience create lasting value" },
      { role: "Support Services Lead", reason: "You're the one everyone trusts to carry the back" },
      { role: "Partnership Manager", reason: "Builds strong teams and alliances through consistent integrity" },
    ],
    nonIdealCareers: [
      { role: "Solo Entrepreneur", reason: "Your power comes from supporting others, not going alone" },
      { role: "Public Speaker", reason: "You don't need the front — you excel at holding the back" },
      { role: "Celebrity Influencer", reason: "Fame isn't your goal — results and loyalty are" },
    ],
    shortNote: "Loyal support pillar that anchors success through patient behind-the-scenes work",
  },

  "文曲": {
    chineseName: "文曲",
    englishName: "Wen Qu",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 8.5 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 7.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 6.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.0 },
    ],
    moneyMakingPath: "Words + Knowledge — teaching, copywriting, editing, online education",
    asEmployee: "Shines as teacher, editor, writer, curriculum developer, marketing content",
    asBoss: "Builds knowledge-based IP — online courses, content coaching, editing services, teaching platforms",
    idealCareers: [
      { role: "Online Course Creator", reason: "Turns knowledge into structured income through teaching" },
      { role: "Copywriter", reason: "Your sharp words make others look good and convert" },
      { role: "Content Strategist", reason: "Explains complex topics in a way that finally makes sense" },
      { role: "Curriculum Developer", reason: "Teaches others without being asked — education is your gift" },
      { role: "Editor / Writer", reason: "Always rewrites things to sound better and clearer" },
    ],
    nonIdealCareers: [
      { role: "Manual Labor", reason: "Your wealth comes from your brain and words, not physical work" },
      { role: "Repetitive Assembly", reason: "You need intellectual challenges, not mindless tasks" },
      { role: "Loud Sales Floor", reason: "You excel at messaging, not high-volume noise" },
    ],
    shortNote: "Sharp educator who transforms knowledge into income through clear communication",
  },

  "文昌": {
    chineseName: "文昌",
    englishName: "Wen Chang",
    primaryWealthCode: "collaborator",
    scores: [
      { key: "collaborator", label: "Collaborator", score: 8.5 },
      { key: "strategyPlanner", label: "Strategy Planner", score: 7.5 },
      { key: "brandingMagnet", label: "Branding Magnet", score: 6.0 },
      { key: "investmentBrain", label: "Investment Brain", score: 5.0 },
    ],
    moneyMakingPath: "Words + Knowledge — teaching, copywriting, editing, online education",
    asEmployee: "Shines as teacher, editor, writer, curriculum developer, marketing content",
    asBoss: "Builds knowledge-based IP — online courses, content coaching, editing services, teaching platforms",
    idealCareers: [
      { role: "Teacher / Educator", reason: "Rational communication turns complex ideas into clear insights" },
      { role: "Content Writer", reason: "Your organized mind makes you a natural problem-solver through words" },
      { role: "Research Analyst", reason: "Precision and intellectual integrity shine in critical thinking roles" },
      { role: "Framework Designer", reason: "Turns messy concepts into structured, sellable frameworks" },
      { role: "Marketing Strategist", reason: "Writes the emails and messaging that actually convert" },
    ],
    nonIdealCareers: [
      { role: "Physical Labor", reason: "Your gift is your brain and articulation, not manual work" },
      { role: "Chaotic Sales Floor", reason: "You need better messaging, not louder marketing" },
      { role: "Unstructured Creative", reason: "Your strength is logical structure, not pure improvisation" },
    ],
    shortNote: "Logical educator who unlocks others' understanding through structured teaching",
  },
};

/**
 * Helper function to get star wealth data by Chinese name
 */
export function getStarWealthData(chineseName: string): StarWealthData | undefined {
  return STAR_WEALTH_CODE_MAP[chineseName];
}

/**
 * Helper function to check if a star is recognized for wealth code analysis
 */
export function isRecognizedWealthStar(chineseName: string): boolean {
  return chineseName in STAR_WEALTH_CODE_MAP;
}
