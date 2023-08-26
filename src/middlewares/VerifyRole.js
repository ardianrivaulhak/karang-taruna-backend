const VerifyRole = {
  User: (req, res, next) => {
    try {
      const user = req.auth.user;
      const ROLE = "User";
      const isUser = user.Roles.find((el) => el.name === ROLE);
      if (isUser) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Forbidden, Please login with user account" });
      }
    } catch (error) {
      console.error("Error in Admin verification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  Admin: (req, res, next) => {
    try {
      const user = req.auth.user;
      const isAdminActive = user.Roles.find(
        (el) => el.name === "Admin" || el.name === "Super Admin"
      );
      if (isAdminActive) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      console.error("Error in Admin verification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  Super_Admin: (req, res, next) => {
    try {
      const user = req.auth.user;
      const isSuperAdminActive = user.Roles.find(
        (el) => el.name === "Super Admin"
      );
      if (isSuperAdminActive) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      console.error("Error in Super_Admin verification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default VerifyRole;
