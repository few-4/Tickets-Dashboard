# ReeRoute: AI-Powered Customer Support Dashboard 🚀

[cite_start]ReeRoute is a modern, high-velocity Customer Support Dashboard designed to eliminate operational bottlenecks for support agents[cite: 2, 5]. [cite_start]By embedding intelligent, structured AI workflows into everyday triage patterns, this platform minimizes the time agents spend reviewing long conversation histories, guessing customer sentiments, and manually drafting responses[cite: 6, 60].

[cite_start]Built from scratch within a rigorous **10-hour sprint**, this MVP acts as a robust full-stack proof-of-concept for an engineering team[cite: 111, 112].

---

## 🛠️ Tech Stack & Tooling

- [cite_start]**Frontend:** React.js initialized via Vite for instantaneous rendering and performance[cite: 21, 24].
- **Backend:** Node.js with Express.js managing modular API routing.
- [cite_start]**Database:** MongoDB configured with Mongoose ORM to optimize JSON-document schema designs[cite: 37, 42].
- [cite_start]**AI Orchestration Framework:** LangChain.js (`@langchain/mistralai`)[cite: 80, 89].
- **Core LLM Engine:** Mistral AI (`mistral-large-latest`) optimized for low-latency JSON structured outputs.

---

## 🏗️ Architectural & Product Decisions

[cite_start]Building this operational infrastructure under a strict time limit required making intentional engineering trade-offs[cite: 118, 152]:

* [cite_start]**High-Performance Database Layer:** To avoid expensive database joins (e.g., MongoDB `$lookup` aggregations) during rapid dashboard refreshes, message threads and internal notes are **embedded directly within the single Ticket document**[cite: 55, 57]. 
* **Deterministic Runtime Guardrails:** Instead of using regex to parse markdown blocks returned by a generative AI engine, this project leverages LangChain’s native `.withStructuredOutput()` bound to a strict **Zod Validation Schema**. This forces Mistral AI to output data that perfectly conforms to our backend models.
* **Synchronous AI Intake Pipeline:** When a new customer message arrives, the LangChain evaluation chain triggers inline before committing the transaction. This minor write trade-off guarantees that when an agent loads the dashboard, the AI summary, sentiment, and category metrics are immediately synchronized—eliminating the need for a complex asynchronous queue (like Redis or BullMQ) for this initial iteration.
* [cite_start]**Human-in-the-Loop Safeguards:** AI-generated response suggestions are presented as an **editable draft text field** within the workspace[cite: 63, 77]. Support agents maintain full control, editing or completely reshaping the content before manually sending it to the client.

---

## ⚡ Features

- [cite_start]**Dynamic Ticket Feed:** Fully functional search and filter endpoints using MongoDB text indexes[cite: 46, 47, 48].
- [cite_start]**Real-Time AI Analytics Bar:** Provides immediate visibility into system metrics, isolating urgent queues and tracking live customer friction patterns (Frustrated, Urgent, Neutral, Happy)[cite: 66].
- [cite_start]**Inline Ticket Summarization:** Condenses historical conversation details into clear 2-3 sentence overviews directly on the workspace layout[cite: 55, 62].
- [cite_start]**Confidence Metrics:** Every AI-driven categorization displays a live calculation score (e.g., `96% Confidence`), letting agents instantly know how reliably the AI handled the classification[cite: 73].

---

## ⚙️ Getting Started

### 1. Environment Configuration
Create a `.env` configuration file inside your server root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MISTRAL_API_KEY=your_mistral_api_key
