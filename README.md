# LUMAA HOME™ (lumaahome.co.uk)
> A Luxury UK Home Decor, Period Restorations & DIY Editorial Magazine — inspired by **Resident™ Magazine**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (Vercel ready)
npm run build
```

---

## 📦 How to Push to GitHub & Deploy to Vercel

### Step 1: Initialize Git & Push to GitHub
```bash
# 1. Initialize git (already initialized)
git add .
git commit -m "Initial commit: LumaaHome luxury magazine"

# 2. Add your GitHub repository remote (replace with your repo URL):
git remote add origin https://github.com/<YOUR_USERNAME>/lumaahome.git

# 3. Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: 1-Click Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New Project"** and select your `lumaahome` repository from GitHub.
3. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**!
5. In **Domains** settings on Vercel, connect your custom domain `lumaahome.co.uk`.

---

## 🎨 Features & Architecture
- **Resident.com Layout**: Centered serif logo, location switcher, horizontal bordered menu ribbon, and crisp 3-column article feed.
- **Pure Editorial Experience**: Zero e-commerce prices, zero calculators, pure focus on high-readability UK decor & DIY journalism.
- **UK-Centric Articles**: Victorian townhouse tours, sash window insulation, bespoke alcove joinery, rental decor hacks.
- **Built-in Reader Modal & Bookmarks**: Fast client-side reading modal with localStorage bookmarks.
