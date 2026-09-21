const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: {
    type: String,
    required: true,
    match: /^\d{10,}$/
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"]
  },
  date_of_birth: { type: Date, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive", "Suspended"]
  }
});

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  phone_number,
  gender,
  date_of_birth,
  membership_status
) {
  if (
    !name ||
    !email ||
    !password ||
    !phone_number ||
    !gender ||
    !date_of_birth ||
    !membership_status
  ) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  if (!/^\d{10,}$/.test(phone_number)) {
    throw Error("Phone number must be numeric and at least 10 digits");
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    throw Error("Gender must be Male, Female or Other");
  }

  if (!["Active", "Inactive", "Suspended"].includes(membership_status)) {
    throw Error("Membership status must be Active, Inactive or Suspended");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    phone_number,
    gender,
    date_of_birth,
    membership_status
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);