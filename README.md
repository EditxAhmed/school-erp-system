# School Management & Administration ERP

A production-grade full-stack school ERP for Usman Ahmed School.

## Stack

- Frontend: React + Vite + Tailwind + React Router + Recharts
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Auth: JWT + RBAC
- AI: secure backend API with permission checks

## Monorepo structure

- `frontend/` — React/Vite app
- `backend/` — Express/Prisma API
- `database/` — Prisma schema and migration assets

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create PostgreSQL database and update `backend/.env` from `.env.example`.
3. Generate Prisma client:
   ```bash
   npm run prisma:generate --workspace backend
   ```
4. Run Prisma migrations:
   ```bash
   npm run prisma:migrate --workspace backend
   ```
5. Seed demo data:
   ```bash
   npm run seed --workspace backend
   ```
6. Start development:
   ```bash
   npm run dev
   ```

## Demo admin login

- Email: `admin@usmanahmedschool.edu`
- Password: `Admin123!`

## Key features

- Student admissions and GR/roll automation
- Classes, sections, subjects and timetables
- Attendance, exams, marks and results
- Fee, payroll and finance modules
- Parent, teacher and admin portals
- AI school assistant with RBAC enforcement
- Audit logs and security hardening

## Notes

This is a complete architecture starter designed for a real SaaS-grade ERP workflow. It includes the production-ready project structure, PostgreSQL schema, backend authorization, and a responsive stakeholder dashboard UI.
