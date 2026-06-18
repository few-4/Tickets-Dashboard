import {
  findTickets,
  findTicketById,
  updateTicketById,
  findTicketByIdLean,
} from "../dao/tickets.dao.js";
import { buildTicketQuery, buildSortOptions } from "../utils/query.utils.js";
import { generateSuggestedReply, analyzeTicketConversations } from "./ai.service.js";

export const getTicketsList = async ({ status, priority, search, sortBy, order }) => {
  const query = buildTicketQuery({ status, priority, search });
  const sortOptions = buildSortOptions(sortBy, order);

  return findTickets(query, sortOptions);
};

export const getTicketDetail = async (ticketId) => {
  const ticket = await findTicketById(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  return ticket;
};

export const updateTicket = async (ticketId, { status, priority }) => {
  const updates = {};
  if (status) updates.status = status;
  if (priority) updates.priority = priority;

  const updatedTicket = await updateTicketById(ticketId, updates);
  if (!updatedTicket) throw { statusCode: 404, message: "Ticket not found" };

  return updatedTicket;
};

export const appendMessage = async (ticketId, { content, senderType, senderName }) => {
  const ticket = await findTicketByIdLean(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  ticket.messages.push({ senderType, senderName, content });

  // If an agent replies, naturally move status out of OPEN to IN_PROGRESS
  if (senderType === "AGENT" && ticket.status === "OPEN") {
    ticket.status = "IN_PROGRESS";
  }

  await ticket.save();
  await ticket.populate("customer");
  return ticket;
};

export const appendInternalNote = async (ticketId, { content, agentName }) => {
  const ticket = await findTicketByIdLean(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  ticket.internalNotes.push({ agentName, content });
  await ticket.save();
  await ticket.populate("customer");

  return ticket;
};

export const getSuggestedReply = async (ticketId) => {
  const ticket = await findTicketById(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  return generateSuggestedReply(ticket, ticket.customer || { name: "Valued Client", company: "their organization" });
};

export const runTicketAIAnalysis = async (ticketId) => {
  const ticket = await findTicketById(ticketId);
  if (!ticket) throw { statusCode: 404, message: "Ticket not found" };

  const analysis = await analyzeTicketConversations(ticket.messages);
  
  if (analysis.aiSummary) ticket.aiSummary = analysis.aiSummary;
  if (analysis.aiSentiment) ticket.aiSentiment = analysis.aiSentiment;
  if (analysis.aiCategory) ticket.aiCategory = analysis.aiCategory;
  if (analysis.aiConfidence) ticket.aiConfidence = analysis.aiConfidence;

  await ticket.save();
  return ticket;
};
