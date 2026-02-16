# 🧩 Attachment Style Analysis App

A modern, interactive application designed to help users discover their attachment style through a comprehensive assessment and deep AI-powered analysis of their chat patterns.

## 🌟 Features

### 1. **Scientific Assessment**
- Interactive questionnaire based on attachment theory.
- Visual progress tracking with animated circular indicators.
- Detailed results dashboard breaking down Anxiety vs. Avoidance.

### 2. **WhatsApp Chat Analysis (Local & Private)**
- **Privacy First**: All analysis happens 100% in your browser. No data is uploaded to any server.
- **Deep Insights**:
  - Response time patterns.
  - Initiation ratios.
  - Sentiment analysis.
  - Emoji usage frequency.
  - Communication rhythm (hourly/weekly activity).

### 3. **Viral Share System**
- **Personalized Cards**: Generates beautiful, shareable images with your attachment style.
- **Cross-Platform Sharing**: One-click sharing to WhatsApp, Twitter, LinkedIn, and more.
- **Instagram Optimized**: Downloadable assets perfect for Stories.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Image Generation**: html-to-image
- **Icons**: Lucide React & Material Symbols

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/paw-snout/attachment-style-app.git
   cd attachment-style-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Vercel will automatically detect Next.js and deploy.

## 🔒 Privacy Note

The WhatsApp analysis feature uses a local parser. When you upload a `_chat.txt` file, it is processed entirely within your device's memory using JavaScript. **Your personal messages never leave your device.**

---
Made with ❤️ for your privacy by pranjall :)
