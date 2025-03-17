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
};

export default zh; 