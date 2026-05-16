import express from "express";

import protect from "../middleware/authMiddleware";

import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController";

const router = express.Router();

router.post("/", protect, createLead);

router.get("/", protect, getLeads);

router.put("/:id", protect, updateLead);

router.delete("/:id", protect, deleteLead);

export default router;