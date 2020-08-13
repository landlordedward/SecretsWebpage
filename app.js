//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require('md5');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB',
  {useNewUrlParser: true,
  useUnifiedTopology: true}
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Add encryption
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

const initialUser = new User({
  email: "a@a.com",
  password: "a@a.com"
});

app.listen("3000", function(req, res) {
  console.log("Server Up!");
});

app.get("/", function(req, res) {
  res.render("home.ejs");
});

app.get("/register", function(req, res) {
  res.render("register.ejs");
});

app.get("/login", function(req, res) {
  res.render("login.ejs");
});

app.post("/register", function(req, res) {
  const emailInput = req.body.username;
  const passwordInput = req.body.password;
  const passwordHash = md5(passwordInput);
  const newUser = new User({
    email:emailInput,
    password:passwordHash
  });
  newUser.save(function(err) {
    if(!err) {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const emailInput = req.body.username;
  const passwordInput = req.body.password;
  const passwordHash = md5(passwordInput);
  User.findOne({email:emailInput}, function(err, user) {
    if (err) {
      console.log("Failed");
      res.redirect("/login");
    } else {
      if (user.password === passwordHash) {
        res.render("secrets");
      } else {
        console.log("Failed");
        res.redirect("/login");
      }
    }
  });
});
