var express = require("express");
var router = express.Router();
const User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res) => {
  const newuser = new User(req.body);
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const user = await newuser.save();
    res.send("user added successfully");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);
    } else {
      return res.status(400).json({ error: "Login Failed....." });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});
router.get("/getallusers", async (req, res) => {
  
  try {
    const user = await User.find(); // Use _id in the query
    res.send(user)
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

module.exports = router;
