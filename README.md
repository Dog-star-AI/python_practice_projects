# 📊 Personal Finance & Task Manager

A comprehensive web application that combines expense tracking and task management with a beautiful, responsive interface. Built for deployment on Netlify with Neon PostgreSQL database.

---

## 🏷️ Badges

![Netlify Status](https://img.shields.io/badge/netlify-deployed-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Database](https://img.shields.io/badge/database-Neon%20PostgreSQL-purple)
![Frontend](https://img.shields.io/badge/frontend-Vanilla%20JS-yellow)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 About

This Personal Finance & Task Manager is a modern web application that helps users:

- **Track Expenses**: Monitor spending with detailed expense records and budget management
- **Manage Tasks**: Organize to-do items with status tracking and due dates
- **Secure Authentication**: User accounts with JWT-based authentication
- **Real-time Analytics**: Dashboard with spending insights and task progress

Originally converted from Python CLI applications to a full-featured web app, this project demonstrates modern web development practices with serverless architecture.

---

## ✨ Features

### 💰 Expense Tracker
- ✅ Add, view, and delete expenses
- 📈 Budget management with visual indicators
- 📊 Real-time spending analytics
- 💳 Expense categorization with descriptions
- 📅 Date-based expense tracking

### 📝 To-Do List Manager
- ✅ Create tasks with detailed descriptions
- 🔄 Status management (Ongoing, Completed, Paused, Abandoned)
- 📅 Start and end date tracking
- 🔍 Filter tasks by status
- ✏️ Edit and remove tasks

### 🔐 User Management
- 👤 Secure user registration and login
- 🔒 JWT-based authentication
- 🏠 Personalized dashboard
- 📱 Responsive design for all devices

### 🎨 User Interface
- 🌈 Modern gradient design
- 📱 Mobile-first responsive layout
- ⚡ Fast and intuitive navigation
- 🔔 Real-time notifications
- 🎯 Clean and accessible interface

---

## 🌐 Live Demo

🚀 **[View Live Application](https://your-netlify-app-name.netlify.app)**

*Demo credentials:*
- Username: `demo`
- Password: `demo123`

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### Backend
- **Netlify Functions** - Serverless API endpoints
- **Node.js** - Runtime environment
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Database
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Connection Pooling** - Efficient database connections

### Deployment
- **Netlify** - Static site hosting and serverless functions
- **GitHub** - Version control and CI/CD

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Neon database account
- Netlify account (for deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Dog-star-AI/python_practice_projects.git
cd python_practice_projects
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Neon database URL and JWT secret
```

4. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

5. **Start development server**
```bash
netlify dev
```

The application will be available at `http://localhost:8888`

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Environment
NODE_ENV=development
```

### Netlify Environment Variables

Set these in your Netlify dashboard under Site Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `NODE_ENV` | Environment (production/development) | ❌ |

---

## 🗄️ Database Schema

The application uses three main tables:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  budget DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ongoing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth` | Login, signup, or verify token |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get user's expenses |
| POST | `/expenses` | Add new expense |
| DELETE | `/expenses/{id}` | Delete expense |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budget` | Get user's budget |
| PUT | `/budget` | Update budget |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get user's tasks |
| POST | `/tasks` | Add new task |
| PUT | `/tasks/{id}` | Update task status |
| DELETE | `/tasks/{id}` | Delete task |

---

## 🚀 Deployment

### Deploy to Netlify

1. **Fork this repository** to your GitHub account

2. **Create a Neon database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project and database
   - Copy the connection string

3. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set the environment variables in Netlify dashboard
   - Deploy the site

4. **Configure custom domain** (optional)
   - Add your custom domain in Netlify settings
   - Configure DNS records

### Manual Deployment

```bash
# Build and deploy
npm run build
netlify deploy --prod
```

---

## 🚀 Usage

### Getting Started

1. **Sign Up**: Create a new account with username and password
2. **Set Budget**: Start by setting your monthly budget
3. **Track Expenses**: Add your daily expenses with descriptions
4. **Manage Tasks**: Create and organize your to-do items
5. **Monitor Progress**: Use the dashboard to track your financial and task progress

### Expense Tracking

- **Add Expense**: Click "Add Expense" and fill in the details
- **View Expenses**: All expenses are listed with dates and amounts
- **Budget Status**: Monitor your spending against your budget
- **Remove Expenses**: Delete incorrect or unwanted entries

### Task Management

- **Create Tasks**: Add tasks with descriptions and due dates
- **Update Status**: Change task status as you progress
- **Filter Tasks**: View tasks by status (all, ongoing, completed, etc.)
- **Track Progress**: Monitor your productivity with the dashboard

### Dashboard Analytics

- **Total Expenses**: See your cumulative spending
- **Budget Remaining**: Track how much budget you have left
- **Active Tasks**: Count of ongoing tasks
- **Visual Indicators**: Color-coded status indicators

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow JavaScript ES6+ standards
- Use semantic HTML5 elements
- Maintain responsive design principles
- Add comments for complex logic
- Test all features before submitting

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Neon Database** - For serverless PostgreSQL hosting
- **Netlify** - For static site hosting and serverless functions
- **Modern CSS** - For responsive design inspiration
- **JWT.io** - For JWT implementation guidance
- **PostgreSQL** - For robust database functionality

---

**Created with ❤️ for better personal finance and productivity management**