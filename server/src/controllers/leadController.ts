import { Request, Response } from "express";

import Lead from "../models/Lead";

interface CustomRequest extends Request {
  user?: any;
}

export const createLead = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
) => {
  try {
    const leads = await Lead.find().sort({
      createdAt: -1,
    });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
