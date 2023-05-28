const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Auth
router.post(
  "/",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a valid email ")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength(8)
      .withMessage("password length short , min 8 char required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("invalid email");
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkPassword) {
      return res.status(404).send("invalid email or password");
    }
    const token = user.generateTokens();
    return res.status(200).json({ user, token });
  }
);

//Register
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a valid email ")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength(8)
      .withMessage("password length short , min 8 char required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(401).send("email already exist ");
    }
    user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
      const savedUser = await user.save();
      res.status(200).send("registered successfully ");
    } catch (err) {
      res.status(400).send({ err });
    }
  }
);

// update product
router.patch("/updatePassword/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const userPassword = await User.findByIdAndUpdate(
      { _id: userId },
      { password: hashPassword },
      { new: true }
    );
    return res.status(200).json({ status: true, data: userPassword });
  } catch (error) {
    return res.status(400).json({ status: false, msg: "error occured! " });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "azizrezgui4@gmail.com",
    pass: "waranunohjdwrktt",
  },
});

router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const {newPassword} = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await sendPasswordResetEmail(email, newPassword);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Helper function to send the password reset email
async function sendPasswordResetEmail(email, temporaryPassword) {
  try {
    await transporter.sendMail({
      from: "azizrezgui4@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your New  password: ${temporaryPassword}`,
    });
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

module.exports = router;
