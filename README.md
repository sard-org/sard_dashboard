# 📘 SARD Admin Dashboard

Frontend admin dashboard for the **SARD Application**, built using **React**, **Vite**, and **Ant Design**. This interface empowers administrators to efficiently manage users, books, authors, categories, and orders.

---

## 📁 Project Structure

```bash
src/
├── assets/                   # Static assets
├── components/
│   ├── Auth/                 # Authentication logic (login, protected routes)
│   ├── Authors/              # Manage authors (Add, List, Update, Details)
│   ├── Books/                # Manage books
│   ├── Categories/           # Manage categories
│   ├── Orders/               # Manage orders
│   ├── Sidebar/              # Sidebar component
│   └── Users/                # Manage users
├── pages/                    # Main route pages
│   ├── Authors.jsx
│   ├── Book.jsx
│   ├── Categories.jsx
│   ├── Orders.jsx
│   └── Users.jsx
├── routes/
│   └── AppRouter.jsx         # Main router configuration
├── utils/
│   └── api.js                # Axios instance for API calls
├── App.jsx                   # Root component
├── main.jsx                  # App entry point
 

✨ Features
🔐 Authentication with protected routes

📚 CRUD operations for books, authors, categories, and users

📦 Order management interface

🎨 Integrated with Ant Design for consistent UI/UX

⚡ Built with Vite for fast performance

🌐 Axios for API integration

🧩 Modular and scalable code structure

🧪 Tech Stack
React 18

Vite

React Router v7

Ant Design (antd)

Axios

React Icons

ESLint


# Clone the repository
git clone https://github.com/your-username/sard-dashboard.git
cd sard-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

🏗 Build

npm run build

To preview the production build locally:

npm run preview

| Script            | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Run the development server    |
| `npm run build`   | Build for production          |
| `npm run preview` | Preview production build      |
| `npm run lint`    | Lint the project using ESLint |


🔗 **Live Dashboard:** [View Online](https://sard-dashboard.vercel.app/)

📁 **GitHub Repository:** [SARD Dashboard on GitHub](https://github.com/sard-org/sard_dashboard)