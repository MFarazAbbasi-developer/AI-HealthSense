const isAdmin = (req, res, next) => {
  if (req.body.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

export default isAdmin;
