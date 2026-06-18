import { ChatMistralAI } from "@langchain/mistralai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import config from "../config/config.js";

// Initialize LangChain's Mistral AI integration
const model = new ChatMistralAI({
  apiKey: config.MISTRAL_API_KEY,
  modelName: "mistral-large-latest", // Use mistral-large-latest for complex structured json task accuracy
  temperature: 0.1, // Lower temperature keeps output deterministic
});

/**
 * Define the validation structure expected by our MongoDB setup using Zod
 */
const ticketAnalysisSchema = z.object({
  aiSummary: z.string().describe("A brief 2-3 sentence overview of the current status and the main issue."),
  aiSentiment: z.enum(["HAPPY", "NEUTRAL", "FRUSTRATED", "URGENT"]).describe("The overall emotional undertone of the customer."),
  aiCategory: z.string().describe("One or two-word categorization like Billing, Technical Bug, etc."),
  aiConfidence: z.number().describe("Confidence rating for this output between 0.0 and 1.0."),
});

/**
 * Analyzes a conversation thread using Mistral AI Structured Output
 */
export async function analyzeTicketConversations(messages) {
  const formattedThread = messages
    .map((m) => `${m.senderType} (${m.senderName}): ${m.content}`)
    .join("\n");

  const analysisPrompt = PromptTemplate.fromTemplate(`
    You are an expert operations AI at ReeRoute customer support. 
    Analyze the following customer support interaction thread.
    
    Conversation History:
    """
    {history}
    """
    
    Extract and format your analysis precisely.
  `);

  try {
    // Mistral natively supports withStructuredOutput using JSON schema under the hood
    const structuredModel = model.withStructuredOutput(ticketAnalysisSchema);
    const chain = analysisPrompt.pipe(structuredModel);

    const result = await chain.invoke({ history: formattedThread });
    return result;
  } catch (error) {
    console.error("Mistral LangChain Analysis Error:", error);
    // Graceful fallback structure to keep dashboard operational
    return {
      aiSummary: "Summary temporarily unavailable.",
      aiSentiment: "NEUTRAL",
      aiCategory: "Uncategorized",
      aiConfidence: 0.5,
    };
  }
}

/**
 * Generates an automated contextual reply using Mistral AI
 */
export async function generateSuggestedReply(ticket, customer) {
  const formattedThread = ticket.messages
    .map((m) => `${m.senderType}: ${m.content}`)
    .join("\n");

  const internalNotes = ticket.internalNotes
    .map((n) => `- ${n.content}`)
    .join("\n");

  const replyPrompt = PromptTemplate.fromTemplate(`
    You are a support agent at ReeRoute replying in a live chat window.
    Write a short, friendly, and helpful chat message to the customer named {customerName} from {company}.
    
    Rules:
    - Write ONLY a brief chat message (2-4 sentences max).
    - Do NOT write an email. No subject lines, no "Dear", no formal greetings, no closing signatures.
    - Do NOT include "Best regards", "Sincerely", or any sign-off block.
    - Be conversational and warm, like a real-time chat reply.
    - If the customer sentiment is FRUSTRATED or URGENT, acknowledge their frustration immediately.
    - Use Internal Notes to guide your response if relevant.
    - End the message naturally without any signature. Just the message text.
    
    Internal Notes from Team:
    {notes}
    
    Conversation History:
    """
    {history}
    """
    
    Reply as a short chat message now:
  `);

  try {
    const chain = replyPrompt.pipe(model);
    const response = await chain.invoke({
      customerName: customer.name,
      company: customer.company || "their organization",
      notes: internalNotes || "No notes added yet.",
      history: formattedThread,
    });

    return {
      suggestion: response.content.trim(),
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("Mistral LangChain Reply Generation Error:", error);
    return { suggestion: "Could not generate a response template at this time." };
  }
}