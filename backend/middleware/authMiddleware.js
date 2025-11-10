import jwt from "jsonwebtoken";

// ✅ Check if user is logged in
export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Check if user has a required role
export function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
}
