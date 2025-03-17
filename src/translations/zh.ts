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
  },
  
  // Profile & Settings
  profile: {
    title: "个人资料",
    personalInfo: "个人信息",
    name: "姓名",
    email: "电子邮箱",
    updateProfile: "更新个人资料",
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
    male: "男性",
    female: "女性",
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
    title: "我的紫微斗数星图",
    subtitle: "查看您的个人紫微斗数星图和分析",
    profileDetails: "个人资料详情",
    keySummary: "关键摘要",
    detailedAnalysis: "详细分析",
    createProfile: "创建您的个人资料",
    createProfileDesc: "要生成您的个人紫微斗数星图，请提供您的出生信息。",
    editProfile: "编辑个人资料",
    career: "事业与财富",
    health: "健康与养生",
    relationships: "人际关系与家庭",
    lifePurpose: "人生目标与精神追求",
    chartVisualization: "星图可视化",
  },
  
  // Result Page
  result: {
    loading: "加载星图中...",
    chart: "星图",
    subtitle: "紫微斗数星图分析",
    chartVisualization: "星图可视化",
    profileDetails: "个人资料详情",
    placeholder: "这是一个占位可视化。在完整实现中，这里将显示一个交互式的紫微斗数星图。",
    house: "宫位",
    createDate: "创建日期",
    lifePath: "人生道路",
    personality: "个性特质",
    relationships: "人际关系",
    career: "事业与财富",
    health: "健康与养生",
    lifePurpose: "人生目标与精神追求",
    detailedAnalysis: "详细分析",
    downloadPDF: "下载PDF",
    shareChart: "分享星图",
    saveToProfile: "保存到个人资料",
  },
};

export default zh; 