const zh = {
  // Common
  common: {
    loading: "加载中...",
    error: "出错了",
    success: "成功",
    cancel: "取消",
    confirm: "确认",
    submit: "提交",
    save: "保存",
    edit: "编辑",
    delete: "删除",
    search: "搜索",
    filter: "筛选",
    moreInfo: "更多信息",
    lessInfo: "收起信息",
    previous: "上一页",
    next: "下一页",
    back: "返回",
    create: "创建",
    retry: "重试",
  },
  
  // Validation
  validation: {
    required: "所有字段都是必填的",
    email: "请输入有效的电子邮箱地址",
    password: {
      length: "密码长度必须至少为6个字符",
      match: "密码不匹配",
    },
    terms: "您必须接受条款和条件",
  },
  
  // Errors
  errors: {
    unexpected: "发生意外错误。请重试。",
  },
  
  // Navigation
  navbar: {
    home: "首页",
    dashboard: "仪表盘",
    profile: "个人资料",
    settings: "设置",
    signIn: "登录",
    signUp: "注册",
    signOut: "退出登录",
  },
  
  // Authentication
  auth: {
    signin: {
      title: "登录",
      email: "电子邮箱",
      password: "密码",
      remember: "记住我",
      forgot: "忘记密码？",
      submit: "登录",
      create: "没有账户？",
      createLink: "创建账户",
    },
    signup: {
      title: "创建账户",
      email: "电子邮箱",
      password: "密码",
      confirmPassword: "确认密码",
      terms: "我同意条款和条件",
      submit: "注册",
      login: "已有账户？",
      loginLink: "登录",
    },
    forgot: {
      title: "忘记密码",
      description: "输入您的电子邮箱，我们将向您发送重置密码的链接。",
      email: "电子邮箱",
      submit: "发送重置链接",
      back: "返回登录",
      success: "重置链接已发送到您的邮箱。请检查您的收件箱。",
    },
    reset: {
      title: "重置密码",
      description: "为您的账户创建新密码。",
      password: "新密码",
      confirmPassword: "确认密码",
      submit: "重置密码",
      login: "返回登录",
      success: "您的密码已成功重置。即将跳转到登录页面。",
      invalidToken: "重置令牌无效或缺失。请重新请求密码重置链接。",
    },
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    forgotPassword: "忘记密码？",
    rememberMe: "记住我",
    noAccount: "还没有账号？",
    hasAccount: "已有账号？",
    createAccount: "创建账号",
    resetPassword: "重置密码",
    resetPasswordLink: "重置密码链接",
    backToSignIn: "返回登录",
    termsAndConditions: "我同意服务条款和隐私政策",
    emailSent: "重置密码链接已发送到您的邮箱",
    checkEmail: "请检查您的邮箱",
    passwordChanged: "密码已成功更改",
    signUpSuccess: "注册成功，请检查您的邮箱进行验证",
    invalidCredentials: "邮箱或密码错误",
    passwordMismatch: "两次输入的密码不一致",
    passwordTooShort: "密码至少需要 8 个字符",
    invalidEmail: "请输入有效的电子邮件地址",
    emailRequired: "请输入电子邮件地址",
    passwordRequired: "请输入密码",
    confirmPasswordRequired: "请确认密码",
    termsRequired: "您必须同意服务条款和隐私政策",
    userNotFound: "找不到该用户",
    emailInUse: "该邮箱已被注册",
    weakPassword: "密码强度太弱",
    resetInvalidToken: "重置令牌无效或已过期，请重新获取密码重置链接",
    unexpectedError: "发生了意外错误，请稍后再试",
    signinText: "登录",
    signupText: "注册",
  },
  
  // Dashboard
  dashboard: {
    welcome: "欢迎回来",
    subtitle: "您的紫微斗数分析和工具",
    recentResults: "最近结果",
    myChart: "查看我的紫微斗数",
    calculateForOthers: "为他人计算",
    learningResources: "学习资源",
    upcomingEvents: "即将到来的活动",
    viewChart: "查看星图",
    newCalculation: "新建计算",
    exploreResources: "探索资源",
    noResults: "暂无结果",
    startCalculating: "从创建新的星图计算开始",
    viewYourChart: "查看和分析您的个人紫微斗数星图",
    createChartForOthers: "为朋友、家人或客户创建并保存星图",
    accessResources: "访问教育内容和参考资料",
    noEvents: "暂无即将举行的活动",
    checkBackLater: "稍后查看计划的活动和课程",
    viewAll: "查看全部",
    viewNow: "立即查看",
    startNow: "立即开始",
    explore: "探索",
    register: "报名参加",
    quickActions: "快捷操作",
    popularResources: "热门资源",
    updatedAgo: "{{time}}前更新",
    savedProfiles: "{{count}}个已保存档案",
    newBadge: "新",
    resourceLinks: {
      basics: "紫微斗数基础入门",
      palaceSystem: "十二宫位系统详解",
      starTypes: "主星解析与影响"
    },
    actions: {
      myChart: {
        title: "我的星盘",
        description: "查看您的个人紫微斗数星盘"
      },
      calculate: {
        title: "计算",
        description: "为他人生成星盘"
      }
    },
    table: {
      name: "姓名",
      date: "日期",
      type: "类型",
      action: "操作",
      view: "查看",
      gender: "性别",
      male: "男",
      female: "女",
      self: "自己",
      other: "他人"
    },
    emptyState: {
      title: "暂无结果",
      description: "从创建新的星盘计算开始。",
      action: "新建计算"
    }
  },
  
  // Profile & Settings
  profile: {
    title: "档案",
    personalInfo: "个人信息",
    name: "姓名",
    email: "电子邮件",
    updateProfile: "更新档案",
    createSelfTitle: "创建您的档案",
    createOtherTitle: "创建新档案",
    createSelfDesc: "请提供您的出生信息，以生成个人紫微斗数星图。",
    createOtherDesc: "请输入您要为其创建星图的人的详细信息。",
    createSelfSuccess: "您的档案已成功创建！",
    createOtherSuccess: "档案已成功创建！",
    createError: "创建档案时出错。请重试。"
  },
  settings: {
    title: "设置",
    theme: "主题",
    language: "语言",
    notifications: "通知",
    privacy: "隐私",
    account: "账户",
    deleteAccount: "删除账户",
    themes: {
      light: "浅色",
      dark: "深色",
      system: "系统默认",
    },
  },
  
  // App
  app: {
    title: "紫微斗数",
    subtitle: "紫微命理学",
  },
  
  // Navigation (for AuthNav)
  nav: {
    dashboard: "仪表盘",
    settings: "设置",
    logout: "退出登录"
  },
  
  // General
  general: {
    back: "返回",
    error: "错误",
    loadingText: "加载中...",
    retry: "重试",
  },
  
  // Calculate page
  calculate: {
    title: "为他人计算",
    subtitle: "为朋友、家人或客户生成紫微斗数星图",
    savedProfiles: "已保存的档案",
    noProfiles: "暂无保存的档案",
    newCalculation: "新建计算",
    enterDetails: "输入个人详细信息以生成其紫微斗数星图",
    generateChart: "生成星图",
    aboutZiWei: "关于紫微斗数",
    whatIsZiWei: "什么是紫微斗数？",
    requiredInfo: "所需信息",
    interpretation: "解读",
    whatIsDescription: "紫微斗数是中国古代占星术系统，根据一个人的出生日期和时间创建星图。它分析天体的位置，提供关于性格、人际关系、事业和人生道路的见解。",
    requiredInfoDescription: "要创建准确的紫微斗数星图，您需要准确的出生日期、时间和地点。信息越精确，星图就越准确。",
    interpretationDescription: "星图分析提供关于生活各个方面的见解，包括事业、人际关系、健康和个人发展。解读结合了传统智慧和现代心理学理解。"
  },
  
  // Form Fields
  form: {
    name: "姓名",
    relationship: "关系",
    gender: "性别",
    birthDate: "出生日期",
    birthTime: "出生时间",
    birthPlace: "出生地点",
    saveProfile: "保存档案",
    selectGender: "选择性别",
    male: "男",
    female: "女",
    namePlaceholder: "姓名",
    relationshipPlaceholder: "例如：朋友、客户、父亲",
    birthPlacePlaceholder: "城市，国家",
    yourNamePlaceholder: "您的姓名",
    theirNamePlaceholder: "他们的姓名",
    cancel: "取消",
    createSelfProfile: "创建我的档案",
    createOtherProfile: "创建档案",
    selectedDate: "选择日期",
    selectTime: "选择时间",
  },
  
  // 404 Page
  notFound: {
    title: "页面未找到",
    message: "您查找的页面不存在或已被移动。",
    backToHome: "返回首页",
    error404: "404",
  },
  
  // Chart info
  chartInfo: {
    name: "姓名",
    gender: "性别",
    birthDate: "出生日期",
    solarDate: "阳历日期",
    shengXiao: "生肖",
    fiveElement: "五行",
  },
  
  // My Chart Page
  myChart: {
    title: "我的紫微斗数星盘",
    subtitle: "查看您个人的紫微斗数星盘和分析",
    profileDetails: "档案详情",
    keySummary: "关键摘要",
    detailedAnalysis: "详细分析",
    createProfile: "创建您的个人资料",
    createProfileDesc: "要生成您的个人紫微斗数星图，请提供您的出生信息。",
    editProfile: "编辑个人资料",
    career: "事业与财富",
    health: "健康与养生",
    relationships: "人际关系与家庭",
    lifePurpose: "人生目标与精神追求",
    chartVisualization: "星盘可视化",
    createOtherProfile: "为他人创建档案",
    fields: {
      name: "姓名",
      type: "类型",
      birthDate: "出生日期",
      birthTime: "出生时间",
      gender: "性别",
      male: "男",
      female: "女",
      self: "本人",
      other: "他人"
    }
  },
  
  // Result Page
  result: {
    loading: "加载星盘中...",
    chart: "星盘",
    subtitle: "紫微斗数星盘分析",
    profileDetails: "档案详情",
    chartVisualization: "星盘可视化",
    chartVisualizationPlaceholder: "这是一个占位图。在完整实现中，这里会显示一个互动式紫微斗数星盘。",
    shareChart: "分享",
    print: "打印",
    refreshChart: "刷新星盘",
    detailedAnalysis: "详细分析",
    keyInsights: "关键洞察",
    house: "宫位",
    scrollToView: "滚动以查看整个星盘",
    pinchToZoom: "捏合以缩放",
    viewportInstructions: "使用缩放控件和滚动以查看整个星盘",
    fields: {
      relationship: "关系",
      birthPlace: "出生地",
      generated: "生成日期"
    },
    insights: {
      lifePath: "人生道路",
      lifePathText: "人生道路洞察的占位文本",
      personality: "性格特质",
      personalityText: "性格特质的占位文本",
      fortune: "财富运势",
      fortuneText: "财富预测的占位文本"
    },
    analysis: {
      careerWealth: "事业与财富",
      careerWealthText: "这是事业与财富详细分析的占位文本。在完整实现中，这里会包含关于职业道路、财务前景和财富管理建议的个性化洞察。",
      suitableCareer: "适合的职业",
      suitableCareerText: "技术，金融，研究",
      financialOutlook: "财务前景",
      financialOutlookText: "稳定且具有增长潜力",
      
      relationshipsFamily: "人际关系与家庭",
      relationshipsFamilyText: "这是人际关系与家庭分析的占位文本。在完整实现中，这里会包含关于关系模式、家庭动态和与他人兼容性的个性化洞察。",
      relationshipStyle: "关系风格",
      relationshipStyleText: "忠诚，耐心，善于分析",
      compatibleSigns: "相配的生肖",
      compatibleSignsText: "马，兔，羊",
      
      healthWellness: "健康与养生",
      healthWellnessText: "这是健康与养生分析的占位文本。在完整实现中，这里会包含关于健康倾向、潜在问题和养生建议的个性化洞察。",
      strengths: "优势",
      strengthsText: "强健的免疫系统，充沛的生命能量",
      areasAttention: "需要关注的领域",
      areasAttentionText: "消化系统，压力管理",
      
      lifePurpose: "人生目标与潜能",
      lifePurposeText: "这是人生目标与潜能分析的占位文本。在完整实现中，这里会包含关于人生使命、精神路径和个人成长机会的个性化洞察。",
      naturalTalents: "天赋才能",
      naturalTalentsText: "分析能力，沟通能力，解决问题能力",
      lifeLessons: "人生课题",
      lifeLessonsText: "平衡，情感表达，信任"
    }
  },
  
  // Analysis components
  analysis: {
    title: "分析",
    career: {
      title: "职业分析",
      demoData: "演示数据",
      careerCount: "职业数量",
      options: "个选项",
      option: "个选项",
      noData: "没有可用的职业数据",
      others: "其他",
      // Career categories
      creators: "创造者",
      caregivers: "照顾者",
      educators: "教育者",
      organizers: "组织者",
      operators: "操作者",
      protectors: "保护者",
      sellers: "销售/影响者",
      // Category descriptions
      "creators.desc": "设计、建造或制作事物（如艺术家、工程师、厨师、作家、软件开发人员）",
      "caregivers.desc": "提供关怀、支持或治愈（如医生、护士、治疗师、社工）",
      "educators.desc": "传授知识或技能（如教师、教练、培训师）",
      "organizers.desc": "规划、管理或协调（如经理、行政人员、项目规划师）",
      "operators.desc": "运行或维护系统、机器或物流（如驾驶员、技术人员、机器操作员）",
      "protectors.desc": "执行规则、确保安全或防御（如警察、军人、安保、消防员）",
      "sellers.desc": "说服、推广或促进交流（如销售人员、营销人员、影响者、律师）",
      
      // Career options - Creators
      "艺术创作": "艺术创作",
      "创意产业": "创意产业",
      "装潢设计": "装潢设计",
      "策划设计": "策划设计",
      "文化创意": "文化创意",
      "表演艺术": "表演艺术",
      "摄影": "摄影",
      "舞蹈": "舞蹈",
      "音乐制作": "音乐制作",
      "文学创作": "文学创作",
      "艺术设计": "艺术设计",
      "礼品设计": "礼品设计",
      "文创产品": "文创产品",
      "编剧写作": "编剧写作",
      "礼仪顾问": "礼仪顾问",
      "珠宝": "珠宝",
      "钟表": "钟表",
      "珍贵细致物品": "珍贵细致物品",
      "广告营销": "广告营销",
      "房地产": "房地产",
      "建材": "建材",
      "工程拆除": "工程拆除",
      "装修工程": "装修工程",
      "高级品": "高级品",
      "机械制造": "机械制造",
      "工程设备": "工程设备",
      "软件工程": "软件工程",
      "工程顾问": "工程顾问",
      "AI开发": "AI开发",
      "技术研发": "技术研发",
      "研究分析": "研究分析",
      "专业技能": "专业技能",
      "特殊技能": "特殊技能",
      "作家": "作家",
      "园艺设计": "园艺设计",
      "车辆改装": "车辆改装",
      "纸业": "纸业",
      "出版印刷": "出版印刷",
      
      // Career options - Caregivers
      "医疗管理": "医疗管理",
      "医疗手术": "医疗手术",
      "中医药": "中医药",
      "药品销售": "药品销售",
      "医护人员": "医护人员",
      "养老服务": "养老服务",
      "社工": "社工",
      "长照服务": "长照服务",
      "志工组织": "志工组织",
      "美容保健": "美容保健",
      "美容护理": "美容护理",
      "美容美发": "美容美发",
      "地下医疗": "地下医疗",
      "月子中心": "月子中心",
      "命理咨询": "命理咨询",
      "家庭服务": "家庭服务",
      "清洁服务": "清洁服务",
      
      // Career options - Educators
      "教育培训": "教育培训",
      "教育辅导": "教育辅导",
      "幼教": "幼教",
      "讲师": "讲师",
      "教学辅助": "教学辅助",
      "宗教传教": "宗教传教",
      "图书馆管理": "图书馆管理",
      "演讲者": "演讲者",
      "演讲": "演讲",
      "研究单位": "研究单位",
      "翻译": "翻译",
      "争议解决专家": "争议解决专家",
      
      // Career options - Organizers
      "管理业": "管理业",
      "高阶主管": "高阶主管",
      "行政官员": "行政官员",
      "行政": "行政",
      "策略顾问": "策略顾问",
      "行政助理": "行政助理",
      "品牌顾问": "品牌顾问",
      "辅助人员": "辅助人员",
      "助理": "助理",
      "顾问": "顾问",
      "辅助岗位": "辅助岗位",
      "人事行政": "人事行政",
      "方向指导": "方向指导",
      "辅助决策": "辅助决策",
      "计划执行": "计划执行",
      "中间人": "中间人",
      "幕后策划": "幕后策划",
      "团队协调": "团队协调",
      "问题解决顾问": "问题解决顾问",
      "创业顾问": "创业顾问",
      "饭店管理": "饭店管理",
      "餐饮顾问": "餐饮顾问",
      
      // Career options - Operators
      "重工业": "重工业",
      "金属业": "金属业",
      "采矿业": "采矿业",
      "生产制造": "生产制造",
      "能源事业": "能源事业",
      "光电产业": "光电产业",
      "交通工具": "交通工具",
      "仓储物流": "仓储物流",
      "船务公司": "船务公司",
      "救灾重建": "救灾重建",
      "服务业": "服务业",
      "软性服务": "软性服务",
      "餐饮业": "餐饮业",
      "饭店前台": "饭店前台",
      "接待": "接待",
      "旅馆业": "旅馆业",
      "清洁行业": "清洁行业",
      "小吃餐饮": "小吃餐饮",
      "种植业": "种植业",
      "畜牧业": "畜牧业",
      "农业行政": "农业行政",
      "肉品加工": "肉品加工",
      "屠宰业": "屠宰业",
      "营养品销售": "营养品销售",
      "自由职业": "自由职业",
      "轻松工作": "轻松工作",
      
      // Career options - Protectors
      "军警系统": "军警系统",
      "政治工作": "政治工作",
      "外交": "外交",
      "公职": "公职",
      "稳定性企业": "稳定性企业",
      "政府单位": "政府单位",
      
      // Career options - Sellers/Influencers
      "金融业": "金融业",
      "财经业": "财经业",
      "银行": "银行",
      "保险": "保险",
      "投资理财": "投资理财",
      "资产管理": "资产管理",
      "会计": "会计",
      "企业财务顾问": "企业财务顾问",
      "财务": "财务",
      "律师": "律师",
      "法务助理": "法务助理",
      "直播主": "直播主",
      "公关": "公关",
      "星探": "星探",
      "网红经济": "网红经济",
      "媒体公关": "媒体公关",
      "宣传传播": "宣传传播",
      "新闻传播": "新闻传播",
      "网评员": "网评员",
      "文书处理": "文书处理",
      "语言沟通": "语言沟通",
      "名牌销售": "名牌销售",
      "水果批发": "水果批发",
      "批发行": "批发行",
      "服饰零售": "服饰零售",
      "女性产品": "女性产品",
      "化妆品": "化妆品",
      "床具销售": "床具销售",
      "小孩用品": "小孩用品",
      "原料买卖": "原料买卖",
      "跳蚤市场": "跳蚤市场",
      "饮料业": "饮料业",
      "国际贸易": "国际贸易",
      "百货公司": "百货公司",
      "市场开发": "市场开发",
      "酒吧": "酒吧",
      "情色行业": "情色行业",
      "中介买卖": "中介买卖",
      "高级汽车": "高级汽车",
      "出租业": "出租业",
      "衣食住行行业": "衣食住行行业"
    },
    health: {
      title: "健康分析"
    }
  },
  
  // ZWDS Chart-specific terminology
  zwds: {
    // Palace names
    palaces: {
      "命宫": "命宫",
      "兄弟": "兄弟宫",
      "夫妻": "夫妻宫",
      "子女": "子女宫",
      "财帛": "财帛宫",
      "疾厄": "疾厄宫",
      "迁移": "迁移宫",
      "交友": "交友宫",
      "官禄": "官禄宫",
      "田宅": "田宅宫",
      "福德": "福德宫",
      "父母": "父母宫"
    },
    
    // Heavenly Stems
    stems: {
      "甲": "甲",
      "乙": "乙",
      "丙": "丙",
      "丁": "丁",
      "戊": "戊",
      "己": "己",
      "庚": "庚",
      "辛": "辛",
      "壬": "壬",
      "癸": "癸"
    },
    
    // Earthly Branches
    branches: {
      "子": "子（鼠）",
      "丑": "丑（牛）",
      "寅": "寅（虎）",
      "卯": "卯（兔）",
      "辰": "辰（龙）",
      "巳": "巳（蛇）",
      "午": "午（马）",
      "未": "未（羊）",
      "申": "申（猴）",
      "酉": "酉（鸡）",
      "戌": "戌（狗）",
      "亥": "亥（猪）"
    },
    
    // Main stars
    mainStars: {
      "紫微": "紫微星",
      "天机": "天机星",
      "太阳": "太阳星",
      "武曲": "武曲星",
      "天同": "天同星",
      "廉贞": "廉贞星",
      "天府": "天府星",
      "太阴": "太阴星",
      "贪狼": "贪狼星",
      "巨门": "巨门星",
      "天相": "天相星",
      "天梁": "天梁星",
      "七杀": "七杀星",
      "破军": "破军星"
    },
    
    // Transformations
    transformations: {
      "化科": "化科",
      "化权": "化权",
      "化禄": "化禄",
      "化忌": "化忌"
    },
    
    // Minor stars
    minorStars: {
      "文昌": "文昌星",
      "文曲": "文曲星",
      "左辅": "左辅星",
      "右弼": "右弼星",
      "天魁": "天魁星",
      "天钺": "天钺星",
      "天厨": "天厨星",
      "天刑": "天刑星",
      "天姚": "天姚星",
      "天喜": "天喜星",
      "地空": "地空星",
      "地劫": "地劫星",
      "火星": "火星",
      "铃星": "铃星"
    },
    
    // Five Elements
    fiveElements: {
      "水二局": "水二局",
      "木三局": "木三局",
      "金四局": "金四局",
      "土五局": "土五局",
      "火六局": "火六局"
    },
    
    // Chart sections
    chart: {
      "年": "年",
      "月": "月",
      "日": "日",
      "时": "时",
      "生肖": "生肖",
      "五行": "五行",
      "阳历": "阳历",
      "阴历": "阴历",
      "男": "男",
      "女": "女",
      "命主": "命主",
      "身主": "身主",
      "大限": "大限",
      "小限": "小限",
      "流年": "流年"
    }
  },
};

export default zh; 