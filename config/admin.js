exports.checkAdmin = function (req, res, next) {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) return res.json({ message: "Need admin privilege" });

  next();
};
