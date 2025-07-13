const validator = require("validator");

const User = require("../models/user");

const validateSignupData = async (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || firstName.trim().length === 0) {
    throw new Error("First name is empty");
  }

  if (!lastName || lastName.trim().length === 0) {
    throw new Error("Last name is Empty");
  }

  if (!emailId || emailId.trim().length === 0) {
    throw new Error("Email id is Empty");
  }

  if (!password || password.trim().length === 0) {
    throw new Error("Password is required and cannot be empty");
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

const validateLoginData = (data) => {
  const { emailId, password } = data;
  const ALLOWED_DATA = ["emailId", "password"];

  const isAllowedData = Object.keys(data).every((k) => {
    return ALLOWED_DATA.includes(k);
  });

  if (!isAllowedData) {
    throw new Error("trying to send extra field");
  }

  if (!emailId || emailId.trim().length === 0) {
    throw new Error("Email Id is empty");
  }

  if (!password || password.trim().length === 0) {
    throw new Error("password is empty");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid EmailId");
  }
};

const validateEditData = (data) => {
  const { firstName, lastName, age, gender, photoUrl, about, skills } = data;

  const ALLOWED_DATA = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoUrl",
    "about",
    "skills",
  ];

  const isAllowedEdit = Object.keys(data).every((field) => {
    return ALLOWED_DATA.includes(field);
  });

  if (!isAllowedEdit) {
    throw new Error("Trying to enter extra field");
  }
};

module.exports = { validateSignupData, validateLoginData, validateEditData };
