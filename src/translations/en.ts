const en = {
  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    back: "Back",
    next: "Next",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    moreInfo: "More Information",
    lessInfo: "Less Information",
    previous: "Previous",
    retry: "Retry",
  },
  
  // Validation
  validation: {
    required: "All fields are required",
    email: "Please enter a valid email address",
    password: {
      length: "Password must be at least 6 characters long",
      match: "Passwords do not match",
    },
    terms: "You must accept the terms and conditions",
  },
  
  // Errors
  errors: {
    unexpected: "An unexpected error occurred. Please try again.",
  },
  
  // Navigation
  navbar: {
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
  },
  
  // Authentication
  auth: {
    signin: {
      title: "Sign In",
      email: "Email",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Sign In",
      create: "Don't have an account?",
      createLink: "Create an account",
    },
    signup: {
      title: "Create an Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      terms: "I agree to the terms and conditions",
      submit: "Sign Up",
      login: "Already have an account?",
      loginLink: "Sign in",
    },
    forgot: {
      title: "Forgot Password",
      description: "Enter your email address and we'll send you a link to reset your password.",
      email: "Email",
      submit: "Send Reset Link",
      back: "Back to login",
      success: "Reset link has been sent to your email. Please check your inbox.",
    },
    reset: {
      title: "Reset Password",
      description: "Create a new password for your account.",
      password: "New Password",
      confirmPassword: "Confirm Password",
      submit: "Reset Password",
      login: "Back to login",
      success: "Your password has been reset successfully. You will be redirected to the login page.",
      invalidToken: "Invalid or missing reset token. Please request a new password reset link.",
    },
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
    resetPasswordLink: "Reset Password Link",
    backToSignIn: "Back to Sign In",
    termsAndConditions: "I agree to the Terms and Conditions and Privacy Policy",
    emailSent: "Password reset link has been sent to your email",
    checkEmail: "Please check your email",
    passwordChanged: "Password has been successfully changed",
    signUpSuccess: "Registration successful, please check your email for verification",
    invalidCredentials: "Invalid email or password",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 8 characters",
    invalidEmail: "Please enter a valid email address",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    confirmPasswordRequired: "Please confirm your password",
    termsRequired: "You must agree to the Terms and Conditions and Privacy Policy",
    userNotFound: "User not found",
    emailInUse: "This email is already in use",
    weakPassword: "Password is too weak",
    resetInvalidToken: "Invalid or expired reset token, please request a new password reset link",
    unexpectedError: "An unexpected error occurred, please try again later",
    signinText: "Sign In",
    signupText: "Sign Up",
  },
  
  // Dashboard
  dashboard: {
    welcome: "Welcome",
    subtitle: "Your Purple Star Astrology analytics and tools",
    recentResults: "Recent Results",
    myChart: "My Purple Star Chart",
    calculateForOthers: "Calculate for Others",
    learningResources: "Learning Resources",
    upcomingEvents: "Upcoming Events",
    viewChart: "View Chart",
    newCalculation: "New Calculation",
    exploreResources: "Explore Resources",
    noResults: "No results yet",
    startCalculating: "Start by creating a new chart calculation",
    viewYourChart: "View and analyze your personal Purple Star Astrology chart",
    createChartForOthers: "Create and save charts for friends, family, or clients",
    accessResources: "Access educational content and reference materials",
    noEvents: "No upcoming events",
    checkBackLater: "Check back later for scheduled events and classes",
    viewAll: "View All",
    viewNow: "View Now",
    startNow: "Start Now",
    explore: "Explore",
    register: "Register",
    quickActions: "Quick Actions",
    popularResources: "Popular Resources",
    updatedAgo: "Updated {{time}} ago",
    savedProfiles: "{{count}} saved profiles",
    newBadge: "New",
    resourceLinks: {
      basics: "Introduction to 紫微斗数 Basics",
      palaceSystem: "Understanding the 12 Palace System",
      starTypes: "Main Stars and Their Influences"
    },
    actions: {
      myChart: {
        title: "My Chart",
        description: "View your personal 紫微斗数 chart"
      },
      calculate: {
        title: "Calculate",
        description: "Generate charts for others"
      }
    },
    table: {
      name: "Name",
      date: "Date",
      type: "Type",
      action: "Action",
      view: "View",
      gender: "Gender",
      male: "Male",
      female: "Female",
      self: "Self",
      other: "Other"
    },
    emptyState: {
      title: "No results yet",
      description: "Get started by creating a new chart calculation.",
      action: "New Calculation"
    }
  },
  
  // Profile & Settings
  profile: {
    title: "Profile",
    personalInfo: "Personal Information",
    name: "Name",
    email: "Email",
    updateProfile: "Update Profile",
    createSelfTitle: "Create Your Profile",
    createOtherTitle: "Create New Profile",
    createSelfDesc: "To generate your personal 紫微斗数 chart, please provide your birth information.",
    createOtherDesc: "Enter the details of the person you're creating a chart for.",
    createSelfSuccess: "Your profile has been created successfully!",
    createOtherSuccess: "The profile has been created successfully!",
    createError: "There was an error creating the profile. Please try again."
  },
  settings: {
    title: "Settings",
    theme: "Theme",
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy",
    account: "Account",
    deleteAccount: "Delete Account",
    themes: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  
  // App
  app: {
    title: "Purple Star Astrology",
    subtitle: "Purple Star Astrology",
  },
  
  // Navigation (for AuthNav)
  nav: {
    dashboard: "Dashboard",
    settings: "Settings",
    logout: "Logout"
  },
  
  // General
  general: {
    back: "Back",
    error: "Error",
    loadingText: "Loading...",
    retry: "Retry",
  },
  
  // Calculate page
  calculate: {
    title: "Calculate for Others",
    subtitle: "Generate 紫微斗数 (Zi Wei Dou Shu) charts for friends, family, or clients",
    savedProfiles: "Saved Profiles",
    noProfiles: "No saved profiles yet",
    newCalculation: "New Calculation",
    enterDetails: "Enter the person's details to generate their 紫微斗数 chart",
    generateChart: "Generate Chart",
    aboutZiWei: "About 紫微斗数 (Zi Wei Dou Shu)",
    whatIsZiWei: "What is 紫微斗数?",
    requiredInfo: "Required Information",
    interpretation: "Interpretation",
    whatIsDescription: "紫微斗数 (Zi Wei Dou Shu) is an ancient Chinese astrology system that creates a chart based on a person's birth date and time. It analyzes the positions of celestial bodies to provide insights into personality, relationships, career, and life path.",
    requiredInfoDescription: "To create an accurate 紫微斗数 chart, you'll need the person's exact birth date, time, and location. The more precise this information, the more accurate the chart will be.",
    interpretationDescription: "The chart analysis provides insights into various aspects of life including career, relationships, health, and personal development. The interpretation combines both traditional wisdom and modern psychological understanding."
  },
  
  // Form Fields
  form: {
    name: "Name",
    relationship: "Relationship",
    gender: "Gender",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    birthPlace: "Birth Place",
    saveProfile: "Save Profile",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    namePlaceholder: "Person's name",
    relationshipPlaceholder: "e.g. Friend, Client, Father",
    birthPlacePlaceholder: "City, Country",
    yourNamePlaceholder: "Your name",
    theirNamePlaceholder: "Their name",
    cancel: "Cancel",
    createSelfProfile: "Create My Profile",
    createOtherProfile: "Create Profile",
    selectedDate: "Selected Date",
    selectTime: "Select Time",
  },
  
  // 404 Page
  notFound: {
    title: "Page not found",
    message: "The page you are looking for doesn't exist or has been moved.",
    backToHome: "Return Home",
    error404: "404",
  },
  
  // Chart info
  chartInfo: {
    name: "Name",
    gender: "Gender",
    birthDate: "Birth Date",
    solarDate: "Solar Date",
    shengXiao: "Sheng Xiao",
    fiveElement: "Five Element",
  },
  
  // My Chart Page
  myChart: {
    title: "My 紫微斗数 Chart",
    subtitle: "View your personal Zi Wei Dou Shu chart and analysis",
    profileDetails: "Profile Details",
    keySummary: "Key Summary",
    detailedAnalysis: "Detailed Analysis",
    createProfile: "Create Your Profile",
    createProfileDesc: "To generate your personal 紫微斗数 chart, please provide your birth information.",
    editProfile: "Edit Profile",
    career: "Career & Wealth",
    health: "Health & Wellness",
    relationships: "Relationships & Family",
    lifePurpose: "Life Purpose & Spirituality",
    chartVisualization: "Chart Visualization",
    createOtherProfile: "Create Profile for Someone Else",
    fields: {
      name: "Name",
      type: "Type",
      birthDate: "Birth Date",
      birthTime: "Birth Time",
      gender: "Gender",
      male: "Male",
      female: "Female",
      self: "Self",
      other: "Other"
    }
  },
  
  // Result Page
  result: {
    loading: "Loading Chart...",
    chart: "Chart",
    subtitle: "紫微斗数 (Zi Wei Dou Shu) chart analysis",
    profileDetails: "Profile Details",
    chartVisualization: "Chart Visualization",
    chartVisualizationPlaceholder: "This is a placeholder visualization. In the full implementation, this would show an interactive 紫微斗数 chart.",
    shareChart: "Share",
    print: "Print",
    refreshChart: "Refresh Chart",
    detailedAnalysis: "Detailed Analysis",
    keyInsights: "Key Insights",
    house: "House",
    scrollToView: "Scroll to view entire chart",  
    pinchToZoom: "Pinch to zoom",
    viewportInstructions: "Use zoom controls and scroll to view all parts of the chart",
    fields: {
      relationship: "Relationship",
      birthPlace: "Birth Place",
      generated: "Generated"
    },
    insights: {
      lifePath: "Life Path",
      lifePathText: "Placeholder for life path insights",
      personality: "Personality",
      personalityText: "Placeholder for personality traits",
      fortune: "Fortune",
      fortuneText: "Placeholder for fortune predictions"
    },
    analysis: {
      careerWealth: "Career & Wealth",
      careerWealthText: "This is a placeholder for detailed career and wealth analysis. In a full implementation, this would contain personalized insights about career path, financial prospects, and wealth management recommendations.",
      suitableCareer: "Suitable Career",
      suitableCareerText: "Technology, Finance, Research",
      financialOutlook: "Financial Outlook",
      financialOutlookText: "Stable with growth potential",
      
      relationshipsFamily: "Relationships & Family",
      relationshipsFamilyText: "This is a placeholder for relationship and family analysis. In a full implementation, this would contain personalized insights about relationship patterns, family dynamics, and compatibility with others.",
      relationshipStyle: "Relationship Style",
      relationshipStyleText: "Loyal, Patient, Analytical",
      compatibleSigns: "Compatible Signs",
      compatibleSignsText: "Horse, Rabbit, Goat",
      
      healthWellness: "Health & Wellness",
      healthWellnessText: "This is a placeholder for health and wellness analysis. In a full implementation, this would contain personalized insights about health tendencies, potential concerns, and wellness recommendations.",
      strengths: "Strengths",
      strengthsText: "Resilient immune system, Strong vital energy",
      areasAttention: "Areas for Attention",
      areasAttentionText: "Digestive system, Stress management",
      
      lifePurpose: "Life Purpose & Potential",
      lifePurposeText: "This is a placeholder for life purpose and potential analysis. In a full implementation, this would contain personalized insights about life mission, spiritual path, and personal growth opportunities.",
      naturalTalents: "Natural Talents",
      naturalTalentsText: "Analysis, Communication, Problem-solving",
      lifeLessons: "Life Lessons",
      lifeLessonsText: "Balance, Emotional expression, Trust"
    }
  },
  
  // Analysis components
  analysis: {
    title: "Analysis",
    career: {
      title: "Career Analysis",
      demoData: "Demo Data",
      careerCount: "Number of Careers",
      options: "options",
      option: "option",
      noData: "No career data available",
      others: "Others",
      // Career categories
      creators: "Creators",
      caregivers: "Caregivers",
      educators: "Educators",
      organizers: "Organizers",
      operators: "Operators",
      protectors: "Protectors",
      sellers: "Sellers/Influencers",
      // Category descriptions
      "creators.desc": "Design, build, or produce things (e.g., artists, engineers, chefs, writers, software developers)",
      "caregivers.desc": "Provide care, support, or healing (e.g., doctors, nurses, therapists, social workers)",
      "educators.desc": "Transfer knowledge or skills (e.g., teachers, coaches, trainers)",
      "organizers.desc": "Plan, manage, or coordinate (e.g., managers, administrators, project planners)",
      "operators.desc": "Run or maintain systems, machines, or logistics (e.g., drivers, technicians, machine operators)",
      "protectors.desc": "Enforce rules, ensure safety, or defend (e.g., police, military, security, firefighters)",
      "sellers.desc": "Persuade, promote, or facilitate exchange (e.g., salespeople, marketers, influencers, lawyers)",
      
      // Career options - Creators
      "艺术创作": "Artistic Creation",
      "创意产业": "Creative Industry",
      "装潢设计": "Interior Design",
      "策划设计": "Planning & Design",
      "文化创意": "Cultural Creation",
      "表演艺术": "Performing Arts",
      "摄影": "Photography",
      "舞蹈": "Dance",
      "音乐制作": "Music Production",
      "文学创作": "Literary Creation",
      "艺术设计": "Art Design",
      "礼品设计": "Gift Design",
      "文创产品": "Cultural Products",
      "编剧写作": "Screenwriting",
      "礼仪顾问": "Etiquette Consultant",
      "珠宝": "Jewelry",
      "钟表": "Watches & Clocks",
      "珍贵细致物品": "Precious Items",
      "广告营销": "Advertising & Marketing",
      "房地产": "Real Estate",
      "建材": "Building Materials",
      "工程拆除": "Demolition Engineering",
      "装修工程": "Renovation Engineering",
      "高级品": "Luxury Goods",
      "机械制造": "Mechanical Manufacturing",
      "工程设备": "Engineering Equipment",
      "软件工程": "Software Engineering",
      "工程顾问": "Engineering Consultant",
      "AI开发": "AI Development",
      "技术研发": "Technical R&D",
      "研究分析": "Research & Analysis",
      "专业技能": "Professional Skills",
      "特殊技能": "Specialized Skills",
      "作家": "Writer",
      "园艺设计": "Landscape Design",
      "车辆改装": "Vehicle Modification",
      "纸业": "Paper Industry",
      "出版印刷": "Publishing & Printing",
      
      // Career options - Caregivers
      "医疗管理": "Medical Management",
      "医疗手术": "Medical Surgery",
      "中医药": "Traditional Chinese Medicine",
      "药品销售": "Pharmaceutical Sales",
      "医护人员": "Medical Staff",
      "养老服务": "Elderly Care",
      "社工": "Social Work",
      "长照服务": "Long-term Care",
      "志工组织": "Volunteer Organization",
      "美容保健": "Beauty & Health",
      "美容护理": "Beauty Care",
      "美容美发": "Beauty & Hair Salon",
      "地下医疗": "Underground Medicine",
      "月子中心": "Postnatal Care Center",
      "命理咨询": "Fortune Telling Consultant",
      "家庭服务": "Family Services",
      "清洁服务": "Cleaning Services",
      
      // Career options - Educators
      "教育培训": "Education & Training",
      "教育辅导": "Educational Tutoring",
      "幼教": "Early Childhood Education",
      "讲师": "Lecturer",
      "教学辅助": "Teaching Assistant",
      "宗教传教": "Religious Missionary",
      "图书馆管理": "Library Management",
      "演讲者": "Speaker",
      "演讲": "Public Speaking",
      "研究单位": "Research Institution",
      "翻译": "Translation",
      "争议解决专家": "Dispute Resolution Expert",
      
      // Career options - Organizers
      "管理业": "Management",
      "高阶主管": "Senior Executive",
      "行政官员": "Administrative Official",
      "行政": "Administration",
      "策略顾问": "Strategic Consultant",
      "行政助理": "Administrative Assistant",
      "品牌顾问": "Brand Consultant",
      "辅助人员": "Support Staff",
      "助理": "Assistant",
      "顾问": "Consultant",
      "辅助岗位": "Support Position",
      "人事行政": "HR Administration",
      "方向指导": "Directional Guidance",
      "辅助决策": "Decision Support",
      "计划执行": "Plan Execution",
      "中间人": "Intermediary",
      "幕后策划": "Behind-the-scenes Planning",
      "团队协调": "Team Coordination",
      "问题解决顾问": "Problem-solving Consultant",
      "创业顾问": "Entrepreneurship Consultant",
      "饭店管理": "Hotel Management",
      "餐饮顾问": "Food & Beverage Consultant",
      
      // Career options - Operators
      "重工业": "Heavy Industry",
      "金属业": "Metal Industry",
      "采矿业": "Mining Industry",
      "生产制造": "Manufacturing",
      "能源事业": "Energy Industry",
      "光电产业": "Optoelectronics Industry",
      "交通工具": "Transportation",
      "仓储物流": "Warehousing & Logistics",
      "船务公司": "Shipping Company",
      "救灾重建": "Disaster Relief & Reconstruction",
      "服务业": "Service Industry",
      "软性服务": "Soft Services",
      "餐饮业": "Food & Beverage Industry",
      "饭店前台": "Hotel Front Desk",
      "接待": "Reception",
      "旅馆业": "Hospitality Industry",
      "清洁行业": "Cleaning Industry",
      "小吃餐饮": "Snack & Dining",
      "种植业": "Cultivation Industry",
      "畜牧业": "Animal Husbandry",
      "农业行政": "Agricultural Administration",
      "肉品加工": "Meat Processing",
      "屠宰业": "Slaughtering Industry",
      "营养品销售": "Nutritional Product Sales",
      "自由职业": "Freelance",
      "轻松工作": "Relaxed Work",
      
      // Career options - Protectors
      "军警系统": "Military & Police System",
      "政治工作": "Political Work",
      "外交": "Diplomacy",
      "公职": "Public Service",
      "稳定性企业": "Stability Enterprise",
      "政府单位": "Government Unit",
      
      // Career options - Sellers/Influencers
      "金融业": "Financial Industry",
      "财经业": "Finance & Economics",
      "银行": "Banking",
      "保险": "Insurance",
      "投资理财": "Investment & Financial Management",
      "资产管理": "Asset Management",
      "会计": "Accounting",
      "企业财务顾问": "Corporate Financial Advisor",
      "财务": "Finance",
      "律师": "Lawyer",
      "法务助理": "Legal Assistant",
      "直播主": "Live Streamer",
      "公关": "Public Relations",
      "星探": "Talent Scout",
      "网红经济": "Internet Celebrity Economy",
      "媒体公关": "Media Public Relations",
      "宣传传播": "Publicity & Communication",
      "新闻传播": "News Communication",
      "网评员": "Online Commentator",
      "文书处理": "Document Processing",
      "语言沟通": "Language Communication",
      "名牌销售": "Brand Sales",
      "水果批发": "Fruit Wholesale",
      "批发行": "Wholesale",
      "服饰零售": "Clothing Retail",
      "女性产品": "Women's Products",
      "化妆品": "Cosmetics",
      "床具销售": "Bedding Sales",
      "小孩用品": "Children's Products",
      "原料买卖": "Raw Material Trading",
      "跳蚤市场": "Flea Market",
      "饮料业": "Beverage Industry",
      "国际贸易": "International Trade",
      "百货公司": "Department Store",
      "市场开发": "Market Development",
      "酒吧": "Bar",
      "情色行业": "Adult Entertainment Industry",
      "中介买卖": "Intermediary Trading",
      "高级汽车": "Luxury Automobiles",
      "出租业": "Rental Industry",
      "衣食住行行业": "Daily Necessities Industry"
    },
    health: {
      title: "Health Analysis"
    }
  },
  
  // ZWDS Chart-specific terminology
  zwds: {
    // Palace names
    palaces: {
      "命宫": "Life",
      "兄弟": "Siblings",
      "夫妻": "Marriage",
      "子女": "Children",
      "财帛": "Wealth",
      "疾厄": "Health",
      "迁移": "Travel",
      "交友": "Friends",
      "官禄": "Career",
      "田宅": "Property",
      "福德": "Fortune",
      "父母": "Parents"
    },
    
    // Heavenly Stems
    stems: {
      "甲": "Jia",
      "乙": "Yi",
      "丙": "Bing",
      "丁": "Ding",
      "戊": "Wu",
      "己": "Ji",
      "庚": "Geng",
      "辛": "Xin",
      "壬": "Ren",
      "癸": "Gui"
    },
    
    // Earthly Branches
    branches: {
      "子": "Zi",
      "丑": "Chou",
      "寅": "Yin",
      "卯": "Mao",
      "辰": "Chen",
      "巳": "Si",
      "午": "Wu",
      "未": "Wei",
      "申": "Shen",
      "酉": "You",
      "戌": "Xu",
      "亥": "Hai"
    },
    
    // Main stars
    mainStars: {
      "紫微": "Purple Star (Emperor)",
      "天机": "Sky Mechanism",
      "天機": "Sky Mechanism",
      "太阳": "Sun",
      "太陽": "Sun",
      "武曲": "Military Song",
      "天同": "Sky Unity",
      "廉贞": "Chastity",
      "廉貞": "Chastity",
      "天府": "Sky Treasury",
      "太阴": "Moon",
      "太陰": "Moon",
      "贪狼": "Greedy Wolf",
      "貪狼": "Greedy Wolf",
      "巨门": "Giant Gate",
      "巨門": "Giant Gate",
      "天相": "Sky Minister",
      "天梁": "Sky Bridge",
      "七杀": "Seven Killings",
      "七殺": "Seven Killings",
      "破军": "Breaker of Armies",
      "破軍": "Breaker of Armies"
    },
    
    // Transformations
    transformations: {
      "化科": "Academic Transformation",
      "化权": "Power Transformation",
      "化權": "Power Transformation",
      "化禄": "Wealth Transformation",
      "化祿": "Wealth Transformation",
      "化忌": "Obstacle Transformation"
    },
    
    // Minor stars
    minorStars: {
      "文昌": "Literary Talent",
      "文曲": "Literary Arts",
      "左辅": "Left Assistant",
      "左輔": "Left Assistant",
      "右弼": "Right Assistant",
      "天魁": "Sky Leader",
      "天钺": "Sky Authority",
      "天厨": "Sky Kitchen",
      "天廚": "Sky Kitchen",
      "天刑": "Sky Punishment",
      "天姚": "Sky Beauty",
      "天喜": "Sky Happiness",
      "地空": "Earth Void",
      "地劫": "Earth Destruction",
      "火星": "Mars (Fire Star)",
      "铃星": "Bell Star",
      "鈴星": "Bell Star"
    },
    
    // Five Elements
    fiveElements: {
      "水二局": "Water Element (2)",
      "木三局": "Wood Element (3)",
      "金四局": "Metal Element (4)",
      "土五局": "Earth Element (5)",
      "火六局": "Fire Element (6)"
    },
    
    // Chart sections
    chart: {
      "年": "Year",
      "月": "Month",
      "日": "Day",
      "时": "Hour",
      "生肖": "Chinese Zodiac",
      "五行": "Five Elements",
      "阳历": "Solar Calendar",
      "阴历": "Lunar Calendar",
      "男": "Male",
      "女": "Female",
      "命主": "Life Master",
      "身主": "Body Master",
      "大限": "Major Limit",
      "小限": "Minor Limit",
      "流年": "Annual Flow"
    }
  },
};

export default en; 