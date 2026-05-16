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
    const {
      status,
      source,
      search,
      sort,
      page = "1",
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const limit = 10;

    const currentPage = Number(page);

    const skip = (currentPage - 1) * limit;

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalLeads = await Lead.countDocuments(query);

    res.status(200).json({
      leads,
      currentPage,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const deleteLead = async (
    req: Request,
    res: Response
  ) => {
    try {
      const lead = await Lead.findById(req.params.id);
  
      if (!lead) {
        return res.status(404).json({
          message: "Lead not found",
        });
      }
  
      await lead.deleteOne();
  
      res.status(200).json({
        message: "Lead deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
      });
    }
  };
