import dotenv from "dotenv/config";
import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Ticket from "../models/ticket.model.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Emptying database for fresh seed...");
    await Customer.deleteMany({});
    await Ticket.deleteMany({});

    const customers = await Customer.insertMany([
      { name: "Alice Smith", email: "alice@enterprise-tech.com", company: "Enterprise Tech Corp" },
      { name: "Bob Jones", email: "bob@retailspace.io", company: "RetailSpace Labs" },
      { name: "Priya Sharma", email: "priya@finova.in", company: "Finova Payments" },
      { name: "Carlos Rivera", email: "carlos@shopflowx.com", company: "ShopFlowX" },
      { name: "Emma Chen", email: "emma@cloudsync.dev", company: "CloudSync Technologies" },
    ]);

    await Ticket.create([
      {
        title: "API Payment Webhook Failures on Production v2",
        status: "OPEN",
        priority: "HIGH",
        customer: customers[0]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Alice Smith", content: "Our production webhooks are timing out since your midnight update. This is halting all checkouts!" },
          { senderType: "AGENT", senderName: "Dev Support", content: "Hi Alice, we're aware of the latency spike and our infra team is investigating. Can you share your webhook endpoint logs?" },
          { senderType: "CUSTOMER", senderName: "Alice Smith", content: "Attached the logs. Latencies are above 5000ms consistently. Our merchants are losing revenue every minute." },
        ],
        internalNotes: [
          { agentName: "On-Call System", content: "Checked integration logs: response latencies are ticking north of 5000ms." },
          { agentName: "Dev Support", content: "Likely caused by the new rate limiter deployed at midnight. Needs rollback." },
        ],
        aiCategory: "Billing / Integrations",
        aiSentiment: "FRUSTRATED",
        aiSummary: "The customer is reporting persistent downtime with payment webhooks following a platform update, breaking production client checkouts.",
        aiConfidence: 0.96,
      },
      {
        title: "Inquiry on volume discount models for Q3 scaling",
        status: "IN_PROGRESS",
        priority: "LOW",
        customer: customers[1]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Bob Jones", content: "We love the product and plan to triple our transaction volume. Do you offer bulk tier discounts?" },
          { senderType: "AGENT", senderName: "Account Manager", content: "Thanks Bob! Absolutely — I'll put together a custom pricing proposal for your projected volume." },
        ],
        aiCategory: "Account Management",
        aiSentiment: "HAPPY",
        aiSummary: "Client looking to expand contract parameters and scale service volume, inquiring about tier pricing breaks.",
        aiConfidence: 0.91,
      },
      {
        title: "Dashboard loading blank after latest Chrome update",
        status: "OPEN",
        priority: "MEDIUM",
        customer: customers[2]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Priya Sharma", content: "Since updating Chrome to v126, the analytics dashboard shows a blank white screen. Firefox works fine." },
          { senderType: "AGENT", senderName: "Tech Support", content: "Thanks for reporting this Priya. Could you open DevTools (F12) and share any console errors you see?" },
          { senderType: "CUSTOMER", senderName: "Priya Sharma", content: "I see: 'TypeError: Cannot read properties of undefined (reading map)' in chunk-vendors.js" },
        ],
        internalNotes: [
          { agentName: "Tech Support", content: "Likely a polyfill issue with the new Chrome version. QA should test against v126." },
        ],
        aiCategory: "Technical Bug",
        aiSentiment: "NEUTRAL",
        aiSummary: "Browser-specific rendering failure on Chrome v126 causing blank dashboard. Firefox unaffected. Likely a JS compatibility issue.",
        aiConfidence: 0.88,
      },
      {
        title: "URGENT: Customer data export returning corrupted CSV files",
        status: "ESCALATED",
        priority: "URGENT",
        customer: customers[3]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Carlos Rivera", content: "Every CSV export we download has garbled characters and missing columns. This is a compliance blocker — we have an audit next week!" },
          { senderType: "AGENT", senderName: "Senior Engineer", content: "Carlos, I've escalated this to our data team. We're seeing an encoding issue in the export pipeline." },
          { senderType: "CUSTOMER", senderName: "Carlos Rivera", content: "This needs to be fixed TODAY. We cannot submit corrupted data to auditors." },
          { senderType: "AGENT", senderName: "Senior Engineer", content: "Understood the urgency. Our team is deploying a hotfix within the next 2 hours. I'll keep you posted." },
        ],
        internalNotes: [
          { agentName: "Senior Engineer", content: "Root cause: UTF-8 BOM not being prepended. Hotfix PR #4821 is ready for review." },
          { agentName: "Engineering Lead", content: "Approved hotfix. Deploy to production ASAP — customer has regulatory deadline." },
        ],
        aiCategory: "Data / Export",
        aiSentiment: "URGENT",
        aiSummary: "Critical compliance-blocking issue with CSV exports producing corrupted files. Customer facing regulatory audit deadline.",
        aiConfidence: 0.97,
      },
      {
        title: "Feature request: Dark mode for agent dashboard",
        status: "OPEN",
        priority: "LOW",
        customer: customers[4]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Emma Chen", content: "Our team works late shifts and the bright white dashboard causes eye strain. Any plans for a dark mode?" },
        ],
        aiCategory: "Feature Request",
        aiSentiment: "NEUTRAL",
        aiSummary: "Customer requesting dark mode support for the agent dashboard to reduce eye strain during night shifts.",
        aiConfidence: 0.93,
      },
      {
        title: "SSO login loop after SAML configuration update",
        status: "IN_PROGRESS",
        priority: "HIGH",
        customer: customers[2]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Priya Sharma", content: "After we updated our SAML IdP certificate, all SSO logins are stuck in a redirect loop. 50+ users locked out!" },
          { senderType: "AGENT", senderName: "Identity Team", content: "We see the certificate mismatch in our logs. Can you re-upload the new certificate in Settings > SSO?" },
          { senderType: "CUSTOMER", senderName: "Priya Sharma", content: "Done. Still looping. Our entire finance team can't access the platform right now." },
        ],
        internalNotes: [
          { agentName: "Identity Team", content: "Certificate uploaded but cached old cert is still being used. Need to flush the SAML metadata cache." },
        ],
        aiCategory: "Authentication",
        aiSentiment: "FRUSTRATED",
        aiSummary: "SSO login redirect loop affecting 50+ users after SAML certificate rotation. Certificate cache likely stale.",
        aiConfidence: 0.94,
      },
      {
        title: "Billing charged twice for March subscription",
        status: "RESOLVED",
        priority: "MEDIUM",
        customer: customers[0]._id,
        messages: [
          { senderType: "CUSTOMER", senderName: "Alice Smith", content: "We were charged twice for March — $2,400 instead of $1,200. Please refund the duplicate charge." },
          { senderType: "AGENT", senderName: "Billing Support", content: "I can confirm the duplicate charge. A refund of $1,200 has been initiated and should appear within 3-5 business days." },
          { senderType: "CUSTOMER", senderName: "Alice Smith", content: "Confirmed — refund received. Thanks for the quick resolution!" },
        ],
        aiCategory: "Billing",
        aiSentiment: "HAPPY",
        aiSummary: "Duplicate billing charge resolved. Refund processed and confirmed by customer.",
        aiConfidence: 0.95,
      },
    ]);

    console.log("🌱 Database populated! 5 Customers and 7 AI-evaluated tickets generated.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedData();