import { Router } from "express";
import { dashboardStats, escalate } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

// 1. GET /api/analytics/dashboard-stats - High level summary cards
analyticsRouter.get("/dashboard-stats", dashboardStats);

// 2. PATCH /api/analytics/:id/escalate - Escalation Override Workflow
analyticsRouter.patch("/:id/escalate", escalate);

export default analyticsRouter;