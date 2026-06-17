import {
  getDashboardStats,
  escalateTicket,
} from "../services/analytics.service.js";

export const dashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to aggregate system performance analytics" });
  }
};

export const escalate = async (req, res) => {
  try {
    const agentName = req.headers["x-agent-name"] || "System Automation Engine";
    const ticket = await escalateTicket(req.params.id, agentName);
    res.json(ticket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Escalation state update routine failure" });
  }
};
