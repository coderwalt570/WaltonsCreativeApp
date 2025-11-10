// Check if user is logged in
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
}

// Allow one or multiple roles
export function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
    }

    const userRole = req.session.user.role.toLowerCase();
    const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
}
