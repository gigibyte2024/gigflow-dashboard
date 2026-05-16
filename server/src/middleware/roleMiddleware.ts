import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

const allowRoles = (...roles: string[]) => {
  return (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export default allowRoles;