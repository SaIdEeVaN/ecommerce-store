# Guide: Hosting Your E-Commerce Store on Vercel with Neon PostgreSQL

This guide walks you through deploying your full-stack Next.js 16 application with Prisma 7, hosted on **Vercel** and powered by a serverless **Neon PostgreSQL** database.

---

## 🚀 Pre-requisites

Make sure your code is tracked in a git repository and pushed to **GitHub**.

### 1. Push Code to GitHub
If you haven't pushed your repository to GitHub yet, run the following commands in your project terminal:
```bash
git add .
git commit -m "feat: complete e-commerce store with prisma 7 & nextauth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
> [!NOTE]
> Make sure to replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## 🐘 Step 1: Set Up Neon PostgreSQL

Neon is a serverless PostgreSQL database designed specifically for modern cloud hosting like Vercel.

1. Go to [Neon.tech](https://neon.tech) and sign up for a free account.
2. Create a new project:
   - **Name**: `ecommerce-store`
   - **Database Name**: `neondb` (default)
   - **Region**: Select the region closest to your target audience (or closest to Vercel's default region, e.g., **Washington, D.C. (us-east-1)**).
3. Once the database is provisioned, you will be shown your **Database Connection String**.
4. In the connection string dropdown, ensure **Pooled connection** is enabled.
5. Copy the connection string. It will look like this:
   ```env
   postgresql://neondb_owner:npg_xxxxxxxxx@ep-xxxxxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

---

## ⚡ Step 2: Deploy to Vercel

Vercel is the creator of Next.js and provides zero-config, highly-optimized serverless deployment.

1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** > **Project**.
3. Import your `ecommerce-store` repository.
4. Expand the **Environment Variables** section and add the following keys:

| Name | Value | Description |
|---|---|---|
| `DATABASE_URL` | *Your Neon Connection String* | The pooled database URL copied from Step 1. |
| `NEXTAUTH_SECRET` | *Generate a random hash* | A secure random string for encryption. You can generate one in your terminal: `openssl rand -base64 32` or type a long random string. |

5. Expand the **Build and Development Settings** section:
   - Locate the **Build Command** field.
   - Click the **Override** toggle next to it.
   - Set the build command to:
     ```bash
     npx prisma db push && next build
     ```
     > [!IMPORTANT]
     > The `npx prisma db push` command ensures that whenever you deploy, Prisma automatically syncs the schema with your Neon PostgreSQL database without needing manual migrations.

6. Click **Deploy**. Vercel will build your application, push the schema to your Neon database, and host your store.

---

## 🌱 Step 3: Seed the Production Database

To populate your live online store with the initial products (Apex Mechanical Keyboard, Acoustic Pro Headset, etc.) and the default **Admin** and **User** login accounts, run the seed script from your local machine targeting your Neon database.

Run this command in your local project terminal:

### On Windows (PowerShell):
```powershell
$env:DATABASE_URL="YOUR_NEON_CONNECTION_STRING"; node prisma/seed.js
```

### On macOS / Linux / Git Bash:
```bash
DATABASE_URL="YOUR_NEON_CONNECTION_STRING" node prisma/seed.js
```

> [!TIP]
> Swap `YOUR_NEON_CONNECTION_STRING` with the connection string you copied from the Neon Console in Step 1.

---

## 🔑 Default Accounts

Once seeded, you can sign in to your live application using these credentials:

*   **Admin Account**:
    - **Email**: `admin@store.com`
    - **Password**: `admin123`
*   **User Account**:
    - **Email**: `user@store.com`
    - **Password**: `user123`
