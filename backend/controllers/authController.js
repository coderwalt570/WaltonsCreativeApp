import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { executeQuery, sql } from "../utils/db.js";

dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await executeQuery(
      "SELECT * FROM Users WHERE Username = @username",
      [{ name: "username", type: sql.VarChar, value: username }]
    );

    if (!users[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    //  compare entered password with PasswordHash column
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // identifier fields
    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.Role
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
