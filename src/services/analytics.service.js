import { aggregateDashboardStats } from "../dao/analytics.dao.js";
import { findTicketByIdLean } from "../dao/tickets.dao.js";

export const getDashboardStats = async () => {
  const stats = await aggregateDashboardStats();

  // Format metrics into flat readable JSON for React charts/KPI blocks
  return {
    statusCounts: stats[0].byStatus.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {},
    ),
    sentimentCounts: stats[0].bySentiment.reduce(
      (acc, curr) => ({ ...acc, [curr._id || "UNKNOWN"]: curr.count }),
      {},
    ),
    escalationQueueCount: stats[0].criticalTickets[0]?.count || 0,
  };
};

export const escalateTicket = async (ticketId, agentName) => {
  const ticket = await findTicketByIdLean(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket profile missing" };

  ticket.status = "ESCALATED";
  ticket.priority = "URGENT";

  ticket.internalNotes.push({
    agentName,
    content: "🚨 Flagged for Priority Escalation via Agent Console.",
  });

  await ticket.save();
  await ticket.populate("customer");
  return ticket;
};
