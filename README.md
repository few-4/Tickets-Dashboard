# ReeRoute: AI-Powered Customer Support Dashboard 🚀

ReeRoute is a modern, high-velocity Customer Support Dashboard designed to eliminate operational bottlenecks for support agents. By embedding intelligent, structured AI workflows into everyday triage patterns, this platform minimizes the time agents spend reviewing long conversation histories, guessing customer sentiments, and manually drafting responses.

---

## 🛠️ Tech Stack & Tooling

- **Frontend:** React.js initialized via Vite for instantaneous rendering and performance.
- **Backend:** Node.js with Express.js managing modular API routing.
- **Database:** MongoDB configured with Mongoose ORM to optimize JSON-document schema designs.
- **AI Orchestration Framework:** LangChain.js (`@langchain/mistralai`).
- **Core LLM Engine:** Mistral AI (`mistral-large-latest`) optimized for low-latency JSON structured outputs.

---

## 🏗️ Architectural & Product Decisions

Building this operational infrastructure under a strict time limit required making intentional engineering trade-offs:

**High-Performance Database Layer:** To avoid expensive database joins (e.g., MongoDB `$lookup` aggregations) during rapid dashboard refreshes, message threads and internal notes are **embedded directly within the single Ticket document**. 
* **Deterministic Runtime Guardrails:** Instead of using regex to parse markdown blocks returned by a generative AI engine, this project leverages LangChain’s native `.withStructuredOutput()` bound to a strict **Zod Validation Schema**. This forces Mistral AI to output data that perfectly conforms to our backend models.
* **Synchronous AI Intake Pipeline:** When a new customer message arrives, the LangChain evaluation chain triggers inline before committing the transaction. This minor write trade-off guarantees that when an agent loads the dashboard, the AI summary, sentiment, and category metrics are immediately synchronized—eliminating the need for a complex asynchronous queue (like Redis or BullMQ) for this initial iteration.
**Human-in-the-Loop Safeguards:** AI-generated response suggestions are presented as an **editable draft text field** within the workspace. Support agents maintain full control, editing or completely reshaping the content before manually sending it to the client.

---

## ⚡ Features

- **Dynamic Ticket Feed:** Fully functional search and filter endpoints using MongoDB text indexes.
- **Real-Time AI Analytics Bar:** Provides immediate visibility into system metrics, isolating urgent queues and tracking live customer friction patterns (Frustrated, Urgent, Neutral, Happy).
- **Inline Ticket Summarization:** Condenses historical conversation details into clear 2-3 sentence overviews directly on the workspace layout.
- **Confidence Metrics:** Every AI-driven categorization displays a live calculation score (e.g., `96% Confidence`), letting agents instantly know how reliably the AI handled the classification.

---

## ⚙️ Getting Started

### 1. Environment Configuration
Create a `.env` configuration file inside your server root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MISTRAL_API_KEY=your_mistral_api_key
