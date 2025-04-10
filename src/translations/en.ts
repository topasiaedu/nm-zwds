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
  
  // ZWDS Chart-specific terminology
  zwds: {
    // Palace names
    palaces: {
      "命宫": "Life Palace",
      "兄弟": "Siblings Palace",
      "夫妻": "Marriage Palace",
      "子女": "Children Palace",
      "财帛": "Wealth Palace",
      "疾厄": "Health Palace",
      "迁移": "Travel Palace",
      "交友": "Friends Palace",
      "官禄": "Career Palace",
      "田宅": "Property Palace",
      "福德": "Fortune Palace",
      "父母": "Parents Palace"
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
      "子": "Zi (Rat)",
      "丑": "Chou (Ox)",
      "寅": "Yin (Tiger)",
      "卯": "Mao (Rabbit)",
      "辰": "Chen (Dragon)",
      "巳": "Si (Snake)",
      "午": "Wu (Horse)",
      "未": "Wei (Goat)",
      "申": "Shen (Monkey)",
      "酉": "You (Rooster)",
      "戌": "Xu (Dog)",
      "亥": "Hai (Pig)"
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