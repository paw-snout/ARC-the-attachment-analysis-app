# Attachment Insight – Product Requirements Document (PRD)

## 1. Product Overview

Attachment Insight is a privacy-first, browser-based behavioral self-reflection tool inspired by attachment theory.

The application:

- Provides a 25-question behavioral assessment
- Calculates 4 behavioral dimensions
- Derives 3 attachment-style tendencies
- Displays structured visual results
- Optionally analyzes exported WhatsApp chat (.txt) locally
- Generates a neutral communication pattern report
- Recommends educational resources
- Emphasizes that real clarity comes from open communication

No data is stored.
No backend.
No API calls.
Fully client-side application.

---

## 2. Core Pages

### Page 1 – Welcome
- Headline
- Subheadline
- Start Assessment CTA
- Privacy note

### Page 2 – Assessment
- Dynamic question rendering (25 questions)
- Likert scale (1–5)
- Progress bar
- Previous / Next navigation

### Page 3 – Results
- 4 Behavioral Dimensions:
  - Abandonment Sensitivity
  - Intimacy Comfort
  - Conflict Regulation
  - Autonomy Preference

- 3 Attachment Tendencies:
  - Secure
  - Anxious
  - Avoidant

- Radar chart or circular visualizations
- Short neutral insight paragraph
- WhatsApp upload section
- Privacy badge

### Page 4 – Communication Pattern Report
(Triggered after file upload)

- Message metrics:
  - Total messages
  - Message ratio (You vs Other)
  - Average response time
  - Initiation frequency
  - Activity timeline

- Charts:
  - Donut chart (message ratio)
  - Timeline chart
  - Response latency bar chart

- Pattern indicators (neutral tone)
- Reflective note about communication > quizzes
- Educational recommendations section

---

## 3. Behavioral Scoring Logic

Each question maps to one of 4 dimensions.
Some questions are reverse scored.

Scoring rule:

dimensionScore += reverse ? (6 - answer) : answer

After computing totals:
Normalize each dimension score to a 0–100 scale.

---

## 4. Attachment Tendency Calculation

Attachment tendencies are pattern clusters derived from behavioral dimensions.

- Secure Tendencies:
  High Intimacy Comfort + High Conflict Regulation

- Anxious Tendencies:
  High Abandonment Sensitivity

- Avoidant Tendencies:
  High Autonomy Preference + Low Intimacy Comfort

Normalize tendency values to percentages for display.

No hard labeling.
No diagnosis.

---

## 5. WhatsApp Chat Parsing (Client-Side Only)

Input: .txt export without media.

Use FileReader API.

Parsing Steps:
- Split file by newline
- Extract timestamp
- Extract sender name
- Extract message content

Compute:
- Total message count
- Message count per sender
- Message ratio
- Average response time between alternating senders
- Initiation frequency
- Daily activity distribution

No sentiment AI.
No external APIs.
No storage.
All in-memory.

---

## 6. Technical Requirements

- Frontend only
- No backend
- No database
- No authentication
- No analytics tracking
- No API calls

Stack:
- Next.js (App Router)
- Tailwind CSS
- Recharts

Must support static export for Netlify deployment.

---

## 7. Non-Functional Requirements

- Clean modular architecture
- Reusable components
- Separated scoring logic
- Separated parsing logic
- Neutral tone
- Ethical wording
- Privacy-first messaging
- Static deployment compatible
