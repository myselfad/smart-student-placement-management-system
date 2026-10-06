# Deploying SSPMS to Production

This guide explains how to deploy the SSPMS (Smart Student Placement Management System) to **Vercel** with a managed **PostgreSQL** database (e.g., Supabase, Neon, or Vercel Postgres).

## Prerequisites

1. A [GitHub](https://github.com/) account.
2. A [Vercel](https://vercel.com/) account (linked to your GitHub).
3. A managed PostgreSQL database (e.g., [Supabase](https://supabase.com) or [Neon](https://neon.tech)).

---

## Step 1: Push Code to GitHub

First, make sure your code is tracked via Git and pushed to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/your-username/sspms.git
git push -u origin main
```

*(Note: The `.gitignore` is correctly configured to prevent secrets from being pushed.)*

---

## Step 2: Prepare your Database

1. Create a new PostgreSQL database on Supabase or Neon.
2. Copy your connection string (it looks like `postgresql://user:password@host:5432/dbname?sslmode=require`).
3. Have this string ready for the next step.

*(Note: Prisma 7 natively supports Vercel Serverless database pooling through `@prisma/adapter-pg`)*

---

## Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`sspms`).
4. Vercel will automatically detect the **Turborepo** architecture.

### Configure Build Settings:
- **Framework Preset:** Turborepo
- **Root Directory:** `./` (Leave as default)
- **Build Command:** `turbo run build`
- **Output Directory:** Leave blank (handled by `vercel.json`)

### Configure Environment Variables:

Add the following environment variables during Vercel setup:

| Variable Name   | Value                                                              |
|-----------------|--------------------------------------------------------------------|
| `DATABASE_URL`  | Your PostgreSQL connection string                                  |
| `JWT_SECRET`    | A secure random string (e.g., `openssl rand -hex 32`)              |
| `FRONTEND_URL`  | The Vercel URL (e.g., `https://sspms-app.vercel.app`)              |
| `NODE_ENV`      | `production`                                                       |

*(Do NOT add `VITE_API_URL`. The app is configured to default to `/api` securely via Vercel rewrites).*

5. Click **Deploy**.

---

## Step 4: Database Migration & Seeding

Vercel will successfully build the app, but the database will be empty.

1. Open your terminal locally.
2. Link your local project to Vercel:
   ```bash
   npx vercel link
   ```
3. Pull the environment variables:
   ```bash
   npx vercel env pull
   ```
4. Push the database schema safely (this creates the tables without dropping them):
   ```bash
   cd apps/api
   npx prisma db push
   ```
5. **(Optional) Seed the demo data:**
   If you want to populate the live database with the 20+ realistic demo students, companies, and applications:
   ```bash
   npm run db:seed
   ```

---

## 🔒 Security Notes

- **Never** run `npx prisma migrate reset` or `npx prisma db seed` on production unless you explicitly want to wipe data.
- The `errorHandler` is now configured for production and will obscure sensitive Prisma stack traces from end-users.
- Passwords are securely hashed via `bcrypt` and stripped from API responses.
- CORS is locked down to your specific frontend URL configured in the environment.

## 🔄 Updates

To update your deployment later, simply commit and push your changes to the `main` branch. Vercel will automatically trigger a new deployment.
