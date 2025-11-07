import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const role = req.session.user.role;

  if (role === "Owner") return res.json({ dashboard: "owner" });
  if (role === "Manager") return res.json({ dashboard: "manager" });
  if (role === "Accountant") return res.json({ dashboard: "accountant" });

  return res.status(403).json({ message: "Unauthorized" });
});

export default router;
