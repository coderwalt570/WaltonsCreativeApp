import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { executeQuery, sql } from "../utils/db.js";

dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Query the Users table
    const users = await executeQuery(
      "SELECT * FROM Users WHERE Username = @username",
      [{ name: "username", type: sql.VarChar, value: username }]
    );

    if (!users[0]) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const user = users[0];
  
    // ✅ Compare password with PasswordHash
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
  
    // ✅ Store user session
    req.session.user = {
      id: user.UserID,
      role: user.Role
    };
  
    // ✅ Send success response
    return res.json({ success: true, role: user.Role });
  
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

