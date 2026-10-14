# SSPMS Production Deployment Architecture

## Target Architecture
- **Frontend:** Vercel (React 19 + Vite + Tailwind CSS)
- **Backend:** Render Web Service (Node.js + Express API)
- **Database:** Supabase PostgreSQL (Managed PostgreSQL)
- **ORM:** Prisma 7 with `@prisma/adapter-pg`
- **File Storage:** Supabase Storage (Persistent object storage for resumes)

---

## 1. Supabase Database & Storage Setup

1. Log in to [Supabase](https://supabase.com) and create or open your project.
2. Go to **Project Settings** -> **Database**.
3. Under **Connection string**, select **URI**:
   - Choose **Mode: Session** (port 5432) or Direct connection.
   - Example URI:
     `postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require`
4. **Create the Storage Bucket:**
   - In Supabase, go to **Storage**.
   - Click **New Bucket**, name it `resumes`.
   - Make it **Public** (or configure public access policy).
5. **Get your API Keys:**
   - In Supabase, go to **Project Settings** -> **API**.
   - Copy **Project URL** (e.g. `https://xyz.supabase.co`).
   - Copy **service_role secret** (for secure backend uploads).

---

## 2. Apply Database Schema to Supabase

Run this once locally from the repository root:

```bash
# Push schema tables to your Supabase PostgreSQL
DATABASE_URL="your-supabase-connection-string" npx prisma db push --schema=apps/api/prisma/schema.prisma

# (Optional) Seed the initial admin and demo data
DATABASE_URL="your-supabase-connection-string" npm run db:seed --workspace=api
```

*(Default seeded admin: `admin@sspms.edu` / `Admin@123`)*

---

## 3. Render Backend Deployment

1. Go to [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `smart-student-placement-management-system`.
3. Configure the service settings:
   - **Name:** `sspms-api`
   - **Environment:** `Node`
   - **Region:** Choose closest to your Supabase region (e.g., US East / Ohio).
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / repository root)*
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node apps/api/dist/index.js`
   - **Health Check Path:** `/health`
4. **Add Environment Variables in Render:**

| Key | Example Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Production environment flag |
| `PORT` | `10000` | (Render sets this automatically) |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` | Supabase PostgreSQL Connection String |
| `JWT_SECRET` | *(64-character random string)* | Auth token signing secret |
| `FRONTEND_URL` | `https://smart-student-placement-management.vercel.app` | Vercel frontend URL for CORS |
| `STORAGE_PROVIDER` | `supabase` | Enables persistent resume storage |
| `SUPABASE_URL` | `https://[ref].supabase.co` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | *(your service_role key)* | Supabase Service Role Secret |
| `SUPABASE_STORAGE_BUCKET` | `resumes` | Resume storage bucket name |
| `DB_POOL_SIZE` | `10` | Database connection pool limit |

5. Click **Create Web Service**. Wait for the deploy to complete and verify `https://your-api.onrender.com/health` returns `{"status":"ok","db":"ok"}`.

---

## 4. Vercel Frontend Configuration

1. Go to your [Vercel Dashboard](https://vercel.com) -> `smart-student-placement-management`.
2. Go to **Settings** -> **Environment Variables**.
3. Add / Update:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-api.onrender.com/api` (replace with your real Render API URL)
4. Trigger a **Redeploy** on Vercel so the frontend builds with the new API URL.

---

## 5. Local Development

To run locally against your local PostgreSQL or Supabase:
```bash
# Install dependencies
npm install

# Start both frontend & backend concurrently
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`
