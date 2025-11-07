export const getDashboard = (req, res) => {
  const role = req.user.role;

  if (role === "Owner") {
    return res.json({ dashboard: "owner" });
  }
  if (role === "Manager") {
    return res.json({ dashboard: "manager" });
  }
  if (role === "Accountant") {
    return res.json({ dashboard: "accountant" });
  }

  return res.status(403).json({ message: "Role not recognized" });
};
