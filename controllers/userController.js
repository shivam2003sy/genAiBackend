const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
 
  const user = await User.create({
    username,
    email,
    password: password,
  });

  
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  
  //compare password with hashedpassword
  if (user && await (password === user.password)
    // (await bcrypt.compare(password, user.password))
    ) {
    
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT || "secretofshivam",
      { expiresIn: "30m" }
    );
    
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});



const googleLogin = asyncHandler(async (req, res) => {
  const googleUser = req.body;
  console.log("Google User: ", googleUser);
  const user = await User.findOne({ email: googleUser.email });
  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT ||  "secretofshivam" ,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    const newUser = await User.create({
      username: googleUser.displayName,
      email: googleUser.email,
      password: 1234,
    });
    if (newUser) {
      const accessToken = jwt.sign(
        {
          user: {
            username: newUser.username,
            email: newUser.email,
            id: newUser.id,
          },
        },
        process.env.ACCESS_TOKEN_SECERT || "secretofshivam",
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  }
}
);

module.exports = { registerUser, loginUser, currentUser, googleLogin };
