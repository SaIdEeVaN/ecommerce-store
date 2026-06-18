# Guide: How to Host Your E-Commerce Web Application

This document provides step-by-step instructions to deploy and host this full-stack Next.js and Prisma PostgreSQL application on the web, completely for free.

---

## Part 1: Provisioning a PostgreSQL Database

Since Next.js runs in serverless environments (like Vercel), your local database (`localhost`) will not be accessible on the web. You need a cloud-hosted PostgreSQL database.

### Option A: Supabase (Recommended - Free Tier)
1. Go to [Supabase](https://supabase.com) and sign up.
2. Create a new project, choose a project name, database password, and your nearest region.
3. Once the project is created, navigate to **Project Settings** > **Database**.
4. Scroll to the **Connection string** section, select **URI**, and copy the connection string.
   - *It will look like:* `postgres://postgres.[your-project-id]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - **Important**: Make sure to replace `[your-password]` with the actual database password you chose during setup.

### Option B: Railway (Very Easy Setup)
1. Go to [Railway](https://railway.app) and sign up.
2. Click **New Project** > **Provision PostgreSQL**.
3. Once the database is ready, go to the **Variables** tab and copy the `DATABASE_URL`.

---

## Part 2: Preparing Your Code for Deployment

Make sure your code is pushed to a remote Git repository (such as **GitHub**).

1. Initialize Git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: complete e-commerce store implementation"
   ```
2. Create a new repository on GitHub (keep it private if you want to secure your database credentials).
3. Link your local project to GitHub and push:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 3: Deploying the Web App to Vercel

Vercel is the creators of Next.js and provides the best, zero-config hosting for Next.js projects.

1. Go to [Vercel](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add the following keys:
   - `DATABASE_URL`: Paste the cloud PostgreSQL connection string you copied in **Part 1**.
   - `NEXTAUTH_SECRET`: Generate a random secure key. You can generate one in your terminal:
     ```bash
     openssl rand -base64 32
     ```
     Or just type a long random string of letters and numbers.
   - `NEXTAUTH_URL`: Paste your deployment URL (e.g. `https://your-app-name.vercel.app`), or leave it blank as Vercel automatically detects and sets this up in many cases.
5. In **Build & Development Settings**, look at the **Build Command**.
   - By default, it runs `next build`.
   - To make sure your cloud database tables are automatically generated when you deploy, change the **Build Command** to:
     ```bash
     npx prisma db push && next build
     ```
6. Click **Deploy**. Vercel will build your application, push the schema to your cloud database, and host your store.

---

## Part 4: Seeding Your Production Database

To populate your live online store with the initial products (Acoustic Headset, Apex Keyboard, etc.) and the default Admin account:

Run the seed script from your local terminal, but swap out the `DATABASE_URL` with your production cloud database URL:

### On Windows (PowerShell):
```powershell
$env:DATABASE_URL="YOUR_SUPABASE_OR_RAILWAY_DATABASE_URL"; node prisma/seed.js
```

### On macOS / Linux / Git Bash:
```bash
DATABASE_URL="YOUR_SUPABASE_OR_RAILWAY_DATABASE_URL" node prisma/seed.js
```

Your cloud database is now fully populated, and your live site is ready to shop!
