# Battery Management System (BMS) - Ensaio

A modern, full-stack Battery Management System dashboard built with React, Vite, Node.js/Express, and PostgreSQL. Includes Docker and Docker Compose support for easy deployment.

## Features
- Admin and User dashboards for battery monitoring and analytics
- User authentication (register/login) with PostgreSQL backend
- Interactive charts, maps, and real-time metrics
- Demo/preview mode for dashboards on the landing page
- Responsive UI with Tailwind CSS
- Full Docker support (frontend, backend, database)

## Project Structure
```
├── backend/           # Node.js/Express backend API
├── public/            # Static assets
├── src/               # React frontend source code
├── Dockerfile         # Frontend Dockerfile
├── docker-compose.yml # Multi-service orchestration
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Git](https://git-scm.com/) installed (for version control)

### Local Development (with Docker Compose)
1. Clone the repository:
   ```
   git clone https://github.com/soumalya-droid/BMS-Ensaio.git
   cd BMS-Ensaio
   ```
2. Start all services:
   ```
   docker-compose up --build
   ```
3. Access the app:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:4000
   - PostgreSQL: localhost:5432 (user: postgres, password: postgres, db: bms)

### Seeding Sample Users
To add demo users (admin, user, demo):
```
docker-compose exec backend node seed-users.js
```

### Demo Accounts
- **Admin:** admin@bms.com / admin123
- **User:** user@bms.com / user123
- **Demo:** demo@bms.com / demo123

## Customization
- Update environment variables in `backend/.env` as needed.
- To use your own data, connect real battery hardware or update the backend API.

## Deployment
You can deploy this stack to any Docker-compatible host or cloud provider. For static hosting of the frontend only, build with `npm run build` and deploy the `dist/` folder.

## License
MIT
