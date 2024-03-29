const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { encode } = require("js-base64");
const authenticateToken = require("../middleware/authenticateToken");
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
router.patch("/updateUser/:userId", authenticateToken, async (req, res) => {
  try {
    const updates = {};

    if (req.body.fullName) {
      updates.fullName = req.body.fullName;
    }

    if (req.body.phoneNumber) {
      updates.phoneNumber = req.body.phoneNumber;
    }

    if (req.body.email) {
      updates.email = req.body.email;
    }
    if (req.body.shippingAddress) {
      updates.shippingAddress = req.body.shippingAddress;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: updates },
      { new: true }
    );

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(400).json({ status: false, msg: "An error occurred" });
  }
});

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
router.patch("/changePassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    return res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(400).json({ status: false, msg: "An error occurred" });
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

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await sendPasswordResetEmail(email);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper function to send the password reset email
async function sendPasswordResetEmail(email) {
  try {
    const encodedEmail = encode(email);
    const resetLink = `https://www.rezgui-aziz.me/reset?email=${encodedEmail}`;
    await transporter.sendMail({
      from: "azizrezgui4@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Reset your password here : ${resetLink}`,
    });
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

module.exports = router;
