export function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
}

export function requireRole(role) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (req.session.user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
}
