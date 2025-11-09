import bcrypt from "bcryptjs";
import { executeQuery, sql } from "./utils/db.js"; // adjust path if needed
import dotenv from "dotenv";
dotenv.config();

async function updatePassword(username, plainPassword) {
  try {
    // 1️⃣ Generate bcrypt hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    // 2️⃣ Update the Users table
    const query = `
      UPDATE Users
      SET PasswordHash = @hash
      WHERE Username = @username
    `;

    await executeQuery(query, [
      { name: "hash", type: sql.VarChar, value: hash },
      { name: "username", type: sql.VarChar, value: username }
    ]);

    console.log(`✅ Password updated for ${username}`);
  } catch (error) {
    console.error("Error updating password:", error);
  }
}

// Example usage:
(async () => {
  await updatePassword("owneruser", "Owner123!"); // set new password
  await updatePassword("manageruser", "Manager123!"); // set new password
  await updatePassword("accountantuser", "Account123!"); // set new password
})();
