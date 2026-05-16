import { Request, Response } from "express";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  res.json({
    message: "Register Route",
  });
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  res.json({
    message: "Login Route",
  });
};
