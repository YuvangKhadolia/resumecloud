const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");

exports.showLogin = (req,res) => res.render("auth/login");
exports.showRegister = (req,res) => res.render("auth/register");

exports.register = async (req,res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await createUser(name, email, hash);
  res.redirect("/login");
};

exports.login = async (req,res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if(!user) return res.render("auth/login", { error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.render("auth/login", { error: "Invalid credentials" });

  req.session.user = user;
  res.redirect("/dashboard");
};

exports.logout = (req,res) => {
  req.session.destroy(() => res.redirect("/login"));
};
