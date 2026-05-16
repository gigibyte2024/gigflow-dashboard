import express from "express";

import protect from "../middleware/authMiddleware";
import allowRoles from "../middleware/roleMiddleware";

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

router.delete(
    "/:id",
    protect,
    allowRoles("admin"),
    deleteLead
  );

export default router;