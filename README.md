# 🚀 Order Management System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


This project is a **Fullstack Order Management System** designed to demonstrate technical skills across backend and frontend development.
It was built as part of a technical test to showcase a scalable architecture, clean code practices, and modern tooling.

---

## 🧩 Overview

The system allows the management of orders through a REST API and a responsive frontend interface.

**Tech Stack:**

- **Backend:** Node.js, Express, PostgreSQL, Docker, Jest
- **Frontend:** React, TypeScript, Vite, TailwindCSS, Axios
- **Environment:** Local development with Docker containers
- **Testing:** Jest (unit and integration tests on backend)

---

## 🗂️ Project Structure

```
/
├── back/          # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── config/
│   │   ├── database/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── jest.config.js
│   ├── docker-compose.yml
│   ├── tsconfig.json
│   ├── .env.template
│   └── package.json
│
└── front/         # Frontend (React + TailwindCSS)
    ├── src/
    ├── public/
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── .env.template
    └── package.json
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/order-management-fullstack.git
cd order-management-fullstack
```

---

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd back
```

#### Create environment variables

Copy the `.env.template` file and fill in your local configuration:

```bash
cp .env.template .env
```

#### Example `.env`

```
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/orders_db
```

#### Run with Docker

Make sure you have Docker and Docker Compose installed, then run:

```bash
docker-compose up --build
```

This will:
- Start a PostgreSQL container
- Run the backend server
- Initialize the database with `init.sql`

The backend will be available at:
👉 `http://localhost:3000/api`

#### Run tests

```bash
npm run test
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd front
```

#### Install dependencies

```bash
npm install
```

#### Create environment variables

```bash
cp .env.template .env
```

#### Example `.env`

```
VITE_API_URL=http://localhost:3000/api
```

#### Run locally

```bash
npm run dev
```

The app will be available at:
👉 `http://localhost:5173`

---

## 🧠 Key Features

### Backend
- RESTful API with Express
- Input validation and error handling
- PostgreSQL integration via `pg`
- Environment-based configuration
- Rate limiting and security middlewares (Helmet, CORS)
- Unit and integration tests with Jest

### Frontend
- Modular React architecture
- State and API management with Axios
- Fully responsive UI with TailwindCSS
- Environment-based API configuration
- Clear separation of components and routes

---

## 🧱 Database

The database is automatically initialized through `init.sql` in the `/database` directory when Docker starts the PostgreSQL container.

---

## 📦 Scripts Summary

### Backend

| Command | Description |
|----------|-------------|
| `npm run start` | Start the server |
| `npm run dev` | Start with nodemon (development) |
| `npm run test` | Run Jest tests |
| `docker-compose up` | Start Docker containers |

### Frontend

| Command | Description |
|----------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |

---

## 🧾 API Endpoints (Example)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/orders` | Retrieve all orders |
| `GET` | `/api/orders/:id` | Retrieve a single order |
| `POST` | `/api/orders` | Create a new order |
| `PUT` | `/api/orders/:id` | Update an existing order |
| `DELETE` | `/api/orders/:id` | Delete an order |

---

## 🧑‍💻 Developer Notes

- Code follows modular and maintainable structure.
- Backend and frontend can run independently or together via Docker.
- Follows clean coding standards and REST best practices.
- Focused on clarity, scalability, and testing.

---

## 📚 Author

**Luis Alexis Galarza**
- GitHub: [@Alexis73](https://github.com/LuisAlexis73)
- LinkedIn: [Alexis Galarza](https://www.linkedin.com/in/luis-alexis-galarza)
- Email: la.galarza@outlook.com
- Portfolio: [https://luisalexisgalarza.com](https://ag-porfolio.vercel.app/)

---

*Built with ❤️ and lots of 🧉*
