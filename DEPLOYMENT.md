# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `conceptspro` repository
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"
7. Your app will be live at `https://conceptspro.vercel.app`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Select your `conceptspro` repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy site"

### Option 3: GitHub Pages
1. Go to your repository settings
2. Scroll to "Pages" section
3. Source: "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

No environment variables are required for basic functionality.

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to your deployment platform settings
2. Add your domain in the custom domain section
3. Update DNS records as instructed
