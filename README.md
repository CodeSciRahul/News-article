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
- **Database**: PostgreSQL (using Neon & Drizzle ORM)
- **APIs**: Serper.dev & Google AI Studio (Gemini API)

## 🔧 Installation & Setup

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/news-article-app.git
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
```

4. **Run the Development Server**

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
├── pages/        # Next.js pages
├── styles/       # Global and Tailwind styles
├── utils/        # Helper functions and API handlers
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

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

### 👨‍💻 Developed by Payam

Feel free to reach out if you have any suggestions or feedback!

