import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    enum: ["CUSTOMER", "AGENT", "AI_ASSISTANT"],
    required: true,
  },
  senderName: { 
    type: String, 
    required: true 
  }, 
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const InternalNoteSchema = new mongoose.Schema({
  agentName: { 
    type: String, 
    required: true 
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "OPEN",
        "IN_PROGRESS",
        "PENDING_CUSTOMER",
        "ESCALATED",
        "RESOLVED",
      ],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Embedded Arrays for high-speed retrieval of complete conversation history
    messages: [MessageSchema],
    internalNotes: [InternalNoteSchema],

    // AI Metadata (Calculated via LLM on ticket creation/updates)
    aiCategory: { type: String, default: null },
    aiSentiment: { type: String, default: null }, // e.g., "FRUSTRATED", "NEUTRAL"
    aiSummary: { type: String, default: null },
    aiConfidence: { type: Number, default: null }, // Product decision: maps how sure the AI is (0.0 to 1.0)
  },
  { timestamps: true },
);

// Indexing for high-performance dashboard searching, filtering, and sorting
TicketSchema.index({ status: 1, priority: 1 });
TicketSchema.index({ title: "text", "messages.content": "text" }); // Enables text search across fields

const ticketModel = mongoose.model("Ticket", TicketSchema);

export default ticketModel;