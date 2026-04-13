<div align="center">
  <img src="https://img.icons8.com/color/124/calculate.png" alt="MathQuiz Logo" width="100"/>
  <h1>🔢 MathQuiz</h1>
  <p><strong>A Lightweight, Client-Side Mathematics Quiz Platform for Students</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  </p>
</div>

<br />

MathQuiz is a fully self-contained, serverless static web application built to help school students (Classes 1–12) practice mathematics. It generates and serves mathematically accurate questions using a purely client-side architecture—requiring zero backend, zero databases, and zero infrastructure overhead.

Perfect for deployment on **GitHub Pages**, **Vercel**, or **Netlify**.

---

## ✨ Key Features

- 🔋 **Zero Backend & Serverless:** 100% static application. All data, states, and user history are managed through browser `localStorage`.
- 📚 **Dynamic Class Syllabus:** Automatically tailors questions by categories (Arithmetic, Trigonometry, Calculus, etc.) spanning Classes 1 through 12.
- 🎨 **Adaptive Theming:** 
  - **Kids (Class 1–5):** Colourful, bright, and playful UI with larger fonts and rounded corners.
  - **Middle School (Class 6–8):** Neutral, structured, distraction-free environment.
  - **High School (Class 9–12):** Clean, focused, "dark mode" aesthetics for advanced learners.
- 🏆 **Gamification & Analytics:** Tracks user XP, progressive leveling, daily streaks, topic-specific accuracy breakdowns, and awards procedural badges.
- ⏱️ **Mock & Practice Modes:** Flexible answering environments with interactive multi-choice options, numerical input, and strict countdown timers.
- ⚙️ **In-browser Admin Panel:** Add, delete, and edit custom questions directly in the browser. They instantly flow into your personal quiz generator.

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite + SWC
- **State Management:** Zustand
- **Routing:** React Router v6
- **Styling:** Custom CSS Variables (Design System)
- **Deployment:** GitHub Pages ready (`npm run build` serves a completely static, path-aware `dist/` directory).

---

## 🚀 Getting Started

### Prerequisites
You need **Node.js 18+** installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ishan0121/Math.quiz.git
   cd Math
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Restock the Quiz Bank:**
   The project includes a Node.js data generation script that outputs ~500 mathematically accurate questions across all class levels directly into the local JSON.
   ```bash
   node scripts/generate.cjs
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5174/Math/` in your browser.

---

## 📂 Project Structure

```text
Math/
├── scripts/
│   └── generate.cjs         # Node script to auto-generate 500+ math questions
├── src/
│   ├── components/          # Reusable UI (NavBar, Layouts)
│   ├── data/                # Local database controllers
│   │   ├── storage.js       # localStorage CRUD wrappers
│   │   └── questions.json   # 500+ auto-generated static questions
│   ├── pages/               # React application views (Dashboard, Quiz, Admin)
│   ├── store/               # Zustand global state (useAuthStore.js)
│   ├── utils/               # Helper logic, syllabus dictionaries, quiz builders
│   ├── App.jsx              # Router & theme initialisation
│   └── index.css            # Centralised, mobile-first design system
├── vite.config.js           # Vite config (GitHub Pages 'base' pre-configured)
└── package.json             # App dependencies
```

---

## 🚢 Deployment (GitHub Pages)

Because MathQuiz consists solely of static files, deploying it via GitHub Pages takes seconds.

1. Build the production application:
   ```bash
   npm run build
   ```
2. By default, `vite.config.js` uses `base: '/Math/'` to ensure proper relative path routing on GitHub.
3. Deploy the resulting `dist/` folder using standard `gh-pages` tooling or GitHub Actions.

---

## ⚙️ Adding New Content

For a completely static architecture, cross-origin web scrapers are prohibited by modern browser security (CORS). However, adding new content is easy:

1. **Via the Application (Local):** Navigate to the **Admin Panel** in the app to build custom questions. These are saved to your local machine instantly.
2. **Via Third-party APIs (Developer Mode):** You can write local Node.js scripts (similar to `scripts/generate.cjs`) that hit open datasets like the [Open Trivia Database (Math Category)](https://opentdb.com/api.php?amount=50&category=19) to extract raw JSON and inject it into your local `src/data/questions.json` file. 

---

<div align="center">
  <i>Built with ❤️ for hassle-free online learning.</i>
</div>
