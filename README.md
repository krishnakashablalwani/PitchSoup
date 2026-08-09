# 🥣 PitchSoup

PitchSoup is an AI-powered platform designed for founders. It helps you build, refine, and perfect your startup pitches using advanced AI tools, giving you everything you need to be investor-ready. 

## ✨ Features

- **Pitch Deck Generator**: Automatically generate a comprehensive 10-slide pitch deck outline (Problem, Solution, Market, etc.) from a single prompt.
- **Pitch Q&A Coach**: Practice your pitch by chatting with an AI investor coach that simulates realistic Q&A and stress-tests your assumptions.
- **Pitch Score**: Get your pitch automatically graded across multiple dimensions (Clarity, Problem/Solution fit, Market Potential, etc.) with actionable feedback.
- **Investor Match**: Find your ideal investor profile by generating a list of compatible venture capital funds tailored to your startup's niche and stage.
- **Battlecards**: Prepare for competition by pitting your startup against competitors in a gamified "VS" view, generating SWOT analyses and talking points.
- **Runway Calculator**: An interactive tool to project your financial runway and understand your burn rate over time.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Icons & Fonts**: Material Symbols, Sora, Hanken Grotesk

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed. You will also need accounts for Clerk, Supabase, and Google Gemini API.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pitchsoup.git
cd pitchsoup
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup (Supabase & Clerk)
1. **Initialize Supabase**: Run the provided SQL migrations in your Supabase SQL Editor to create the `User` and `Pitch` tables.
2. **Clerk JWT Template**: In your Clerk Dashboard, go to **Configure > JWT Templates**, click **New Template**, select **Supabase**, name it exactly `supabase`, and save.
3. **Webhook Sync**: In your Clerk Dashboard, go to **Configure > Webhooks** and add your endpoint (`https://your-domain.com/api/webhooks/clerk`). This ensures new users are automatically synced to your Supabase `User` table. *Note: If developing locally, use `npx svix listen -u http://localhost:2000/api/webhooks/clerk` to forward webhooks.*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or whichever port your dev server is running on) with your browser to see the app in action.

---

## 📦 Deployment

The easiest way to deploy PitchSoup is to use the [Vercel Platform](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Add all the environment variables from your `.env.local` into the Vercel project settings.
4. Click **Deploy**.

*Don't forget to update your Clerk Webhook URL to point to your new Vercel production domain!*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is licensed under the MIT License.
