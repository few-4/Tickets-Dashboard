import { Router } from "express";
import {
  addInternalNotes,
  addMessage,
  getTicketDetails,
  getTickets,
  updateTicketStatus,
  getSuggestedReplyHandler,
  analyzeTicketHandler,
} from "../controllers/tickets.controller.js";

const ticketRouter = Router();

// 1. GET /api/tickets - List, Search, Filter, and Sort tickets
ticketRouter.get('/', getTickets);

// 2. GET /api/tickets/:id - Get complete ticket details & conversation history
ticketRouter.get('/:id', getTicketDetails);

// 3. PATCH /api/tickets/:id/status - Update ticket status or priority
ticketRouter.patch('/:id/status', updateTicketStatus);

// 4. POST /api/tickets/:id/messages - Add agent or customer message
ticketRouter.post('/:id/messages', addMessage);

// 5. POST /api/tickets/:id/notes - Add internal collaboration notes
ticketRouter.post('/:id/notes', addInternalNotes);

// 6. GET /api/tickets/:id/suggested-reply - AI response generation draft
ticketRouter.get('/:id/suggested-reply', getSuggestedReplyHandler);

// 7. POST /api/tickets/:id/analyze - AI trigger to re-run category & sentiment analysis
ticketRouter.post('/:id/analyze', analyzeTicketHandler);

export default ticketRouter;