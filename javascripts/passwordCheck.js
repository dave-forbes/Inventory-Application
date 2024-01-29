function passwordCheck(req, res, next) {
  const input = req.body.password;

  if (input === "secretpassword") {
    next();
  } else {
    res.render("error", {
      message:
        "Incorrect password, only admins can delete or update, the password is 'secretpassword'.",
    });
  }
}

module.exports = passwordCheck;

// (req, res, next) => passwordCheck(req, res, next),

// const passwordCheck = require("../javascripts/passwordCheck");
