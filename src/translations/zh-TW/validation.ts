const validation = {
  validation: {
    required: "所有欄位都是必填的",
    email: "請輸入有效的電子郵件地址",
    password: {
      length: "密碼長度必須至少為6個字元",
      match: "密碼不一致",
    },
    terms: "您必須接受條款和條件",
  },

  errors: {
    unexpected: "發生意外錯誤。請重試。",
  },
};

export default validation;
