# News Article App

A dynamic news article platform built with **Next.js**, **TypeScript**, **MUI**, **Tailwind CSS**, and powered by **Serper.dev** and **Google AI Studio (Gemini API)**. This app offers a clean and responsive UI for browsing news articles, with powerful filtering options for a streamlined user experience.

## 🚀 Features

- 🔍 **News Filtering**: Sidebar filters to help users navigate and find relevant news categories.
- 📰 **Responsive News Cards**: Display news articles in an engaging and organized format.
- ⚡ **Fast Performance**: Optimized with **Bun** runtime for lightning-fast execution.
- 🤖 **AI-Powered Content**: Fetch news using Serper.dev and enhance articles with Google AI Studio.
- 🎨 **Modern UI**: Built using **MUI** and styled with **Tailwind CSS** for a sleek, modern design.

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js (with Bun runtime)
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS & MUI
- **Database**: PostgreSQL (using Drizzle ORM and Docker to create instance of Postgree DB)
- **APIs**: Serper.dev & Google AI Studio (Gemini API)

## 🔧 Installation & Setup

1. **Clone the Repository**

```bash
git clone https://github.com/CodeSciRahul/News-article.git
cd news-article-app
```

2. **Install Dependencies** (using Bun)

```bash
bun install
```

3. **Set Up Environment Variables**

Create a `.env` file and add the following:

```
SERPER_API_KEY=your_serper_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=your_database_url
```
Create a `.env.local` file and add the following:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_next_public_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

4. **Run the Development Server**

### To run the Project follow these step.
   ## 1 Install the Docker if not installed.
   ## 2 Run the following cmd
   ```bash
   docker compose up -d
   ```
   ## Start the news-article container from Docker GUI
   ## Run the fullowing cmd.
   ```bash
    bun run dev
   ```

5. **Build for Production**

```bash
bun run build
bun start
```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── app/        # Next.js pages and api
├── styles/       # Global and Tailwind styles
├── db/        # To create database schema
├── lib/          # Database and ORM configurations
```

## ✅ Future Improvements

- 🔗 Social media sharing for articles
- 💾 Save and bookmark functionality
- 📊 Analytics for trending topics
- 🌙 Dark mode support

## 🙌 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a Pull Request


---

### 👨‍💻 Developed by Rahul Kumar

Feel free to reach out if you have any suggestions or feedback!

