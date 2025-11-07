import jwt from "jsonwebtoken";
import { executeQuery, sql } from "../utils/db.js"; // ✅ make sure sql is imported
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Compare password hash in SQL Server instead of bcrypt
    const query = `
      SELECT UserID, Username, Role
      FROM Users
      WHERE Username = @username
        AND PasswordHash = HASHBYTES('SHA2_256', @password)
    `;

    const result = await executeQuery(query, [
      { name: "username", type: sql.VarChar, value: username },
      { name: "password", type: sql.VarChar, value: password }
    ]);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result[0];
    
    // Create token
    const token = jwt.sign(
      { userId: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.Role
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
