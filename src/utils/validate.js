const validator = require("validator");
const User = require("../models/user");

const validateSignupData = async (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (
    !firstName?.trim() === 0 ||
    !lastName?.trim() === 0 ||
    !emailId?.trim() === 0 ||
    !password?.trim() === 0
  ) {
    throw new Error("Input field is empty");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email Id");
  }

  const ALLOWED_DATA = ["firstName", "lastName", "emailId", "password"];

  const isAllowedData = Object.keys(data).every((k) => {
    return ALLOWED_DATA.includes(k);
  });

  if (!isAllowedData) {
    throw new Error("Trying to add extra field");
  }

  data.emailId = data.emailId.toLowerCase();

  const existingEmail = await User.findOne({ emailId: data.emailId });

  if (existingEmail) {
    throw new Error("User with this email already exists");
  }

  return {
    ...data,
    emailId: emailId.toLowerCase(),
  };
};

module.exports = { validateSignupData };
