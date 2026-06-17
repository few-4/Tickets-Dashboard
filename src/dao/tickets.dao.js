import ticketModel from "../models/ticket.model.js";
import "../models/customer.model.js"; 

export const findTickets = (query, sortOptions) => {
  return ticketModel
    .find(query)
    .populate("customer", "name email company")
    .sort(sortOptions)
    .select(
      "title status priority customer aiCategory aiSentiment aiSummary aiConfidence createdAt",
    );
};

export const findTicketById = (id) => {
  return ticketModel.findById(id).populate("customer");
};

export const updateTicketById = (id, updates) => {
  return ticketModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { returnDocument: "after" },
  );
};

export const findTicketByIdLean = (id) => {
  return ticketModel.findById(id);
};