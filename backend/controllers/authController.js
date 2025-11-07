import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { executeQuery } from "../utils/db.js";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await executeQuery(
      "SELECT * FROM Users WHERE username = @username",
      [{ name: "username", type: sql.VarChar, value: username }]
    );

    if (!user[0]) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Logged in successfully", role: user[0].role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
