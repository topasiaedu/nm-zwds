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
  },
  
  // Profile & Settings
  profile: {
    title: "Profile",
    personalInfo: "Personal Information",
    name: "Name",
    email: "Email",
    updateProfile: "Update Profile",
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
  },
  
  // Result Page
  result: {
    loading: "Loading Chart...",
    chart: "Chart",
    subtitle: "紫微斗数 (Zi Wei Dou Shu) chart analysis",
    chartVisualization: "Chart Visualization",
    profileDetails: "Profile Details",
    placeholder: "This is a placeholder visualization. In the full implementation, this would show an interactive 紫微斗数 chart.",
    house: "House",
    createDate: "Created",
    lifePath: "Life Path",
    personality: "Personality",
    relationships: "Relationships",
    career: "Career & Wealth",
    health: "Health & Wellness",
    lifePurpose: "Life Purpose & Spirituality",
    detailedAnalysis: "Detailed Analysis",
    downloadPDF: "Download PDF",
    shareChart: "Share Chart",
    saveToProfile: "Save to Profile",
  },
};

export default en; 