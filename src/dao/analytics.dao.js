import ticketModel from "../models/ticket.model.js";

export const aggregateDashboardStats = () => {
  return ticketModel.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
        bySentiment: [
          { $group: { _id: "$aiSentiment", count: { $sum: 1 } } },
        ],
        criticalTickets: [
          {
            $match: {
              $or: [
                { priority: "URGENT" },
                { aiSentiment: "FRUSTRATED" },
              ],
              status: { $ne: "RESOLVED" },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);
};
