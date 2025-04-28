const validation = {
  validation: {
    required: "所有字段都是必填的",
    email: "请输入有效的电子邮箱地址",
    password: {
      length: "密码长度必须至少为6个字符",
      match: "密码不匹配",
    },
    terms: "您必须接受条款和条件",
  },
  
  errors: {
    unexpected: "发生意外错误。请重试。",
  },
};

export default validation; 