import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = JSON.parse(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // password is already hashed in frontend using bcryptjs
    const newUser = new User({ name, email, password });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
