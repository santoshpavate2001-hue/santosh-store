# Santosh Store — Setup Guide

Full-stack gadget store website:
**santoshstore.netlify.app** | Owner: Santosh Pavate

---

## Stack
| Layer     | Service              | Cost  |
|-----------|----------------------|-------|
| Frontend  | HTML + CSS + JS      | Free  |
| Backend   | Netlify Functions    | Free  |
| Database  | MongoDB Atlas        | Free  |
| Hosting   | Netlify              | Free  |
| Code      | GitHub               | Free  |

---

## Step 1 — MongoDB Atlas

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Create a **Free cluster** (M0 tier, any region)
3. Under **Database Access** → Add a database user
   - Username: `santoshstore`
   - Password: choose something strong (save it)
4. Under **Network Access** → Add IP Address → Allow access from anywhere (`0.0.0.0/0`)
5. Click **Connect** on your cluster → **Drivers** → Copy the connection string

It looks like:
```
mongodb+srv://santoshstore:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `<password>` with your actual password.

---

## Step 2 — GitHub

1. Go to **https://github.com** → New repository
2. Name it `santosh-store` → Public → Create
3. Upload all the project files (drag and drop, or use GitHub Desktop)

---

## Step 3 — Netlify

1. Go to **https://netlify.com** → Sign up with GitHub
2. Click **Add new site → Import from Git → GitHub**
3. Select your `santosh-store` repository
4. Build settings:
   - Build command: `npm install`
   - Publish directory: `.`  (leave as dot)
5. Click **Deploy site**
6. After deploy → go to **Site settings → Domain** → Change to `santoshstore`

---

## Step 4 — Environment Variables (IMPORTANT)

In Netlify → **Site Configuration → Environment Variables** → Add:

| Key              | Value                              |
|------------------|------------------------------------|
| `MONGODB_URI`    | your MongoDB connection string     |
| `ADMIN_PASSWORD` | a password you choose for admin    |

Click **Save** then **Trigger redeploy**.

---

## How to use Admin Panel

Go to: **https://santoshstore.netlify.app/admin**

- Login with the `ADMIN_PASSWORD` you set above
- **Products tab** → Add new products (they appear on the main site instantly)
- **Inquiries tab** → See customer inquiry forms, mark them resolved

---

## File Structure

```
santosh-store/
├── index.html                  ← Main website
├── netlify.toml                ← Netlify config
├── package.json                ← MongoDB dependency
├── admin/
│   └── index.html              ← Admin panel
└── netlify/
    └── functions/
        ├── lib/
        │   └── db.js           ← MongoDB connection
        ├── products.js         ← GET products API
        ├── inquiry.js          ← POST inquiry API
        └── admin.js            ← Admin CRUD API
```

---

## MongoDB Collections

- **products** — your product catalog
- **inquiries** — customer inquiry forms

Both are in the `santoshstore` database, created automatically on first use.

---

## After going live

- Update your phone number in `index.html` (search for `+91 98765 43210`)
- Update your address (search for `Gokul Road`)
- Add products via the Admin panel
- Share **santoshstore.netlify.app** with customers!
