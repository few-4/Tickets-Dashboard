import {
  getTicketsList,
  getTicketDetail,
  updateTicket,
  appendMessage,
  appendInternalNote,
  getSuggestedReply,
  runTicketAIAnalysis,
} from "../services/tickets.service.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await getTicketsList(req.query);
    res.json(tickets);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Server error fetching tickets" });
  }
};

export const getTicketDetails = async (req, res) => {
  try {
    const ticket = await getTicketDetail(req.params.id);
    res.json(ticket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Server error fetching ticket detail" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const updatedTicket = await updateTicket(req.params.id, req.body);
    res.json(updatedTicket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to update ticket configuration" });
  }
};

export const addMessage = async (req, res) => {
  try {
    const ticket = await appendMessage(req.params.id, req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to append message" });
  }
};

export const addInternalNotes = async (req, res) => {
  try {
    const agentName = req.headers["x-agent-name"] || "Default Agent";
    const ticket = await appendInternalNote(req.params.id, {
      content: req.body.content,
      agentName,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to add internal note" });
  }
};

export const getSuggestedReplyHandler = async (req, res) => {
  try {
    const reply = await getSuggestedReply(req.params.id);
    res.json(reply);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to generate AI suggested reply" });
  }
};

export const analyzeTicketHandler = async (req, res) => {
  try {
    const ticket = await runTicketAIAnalysis(req.params.id);
    res.json(ticket);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to run AI analysis on ticket" });
  }
};