const validation = {
  validation: {
    required: "All fields are required",
    email: "Please enter a valid email address",
    password: {
      length: "Password must be at least 6 characters long",
      match: "Passwords do not match",
    },
    terms: "You must accept the terms and conditions",
  },
  
  errors: {
    unexpected: "An unexpected error occurred. Please try again.",
  },
};

export default validation; 