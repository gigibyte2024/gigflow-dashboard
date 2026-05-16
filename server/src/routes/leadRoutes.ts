import express from "express";

import protect from "../middleware/authMiddleware";

import {
  createLead,
  getLeads,
} from "../controllers/leadController";

const router = express.Router();

router.post("/", protect, createLead);

router.get("/", protect, getLeads);

export default router;