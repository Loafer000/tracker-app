# 💡 Startup Idea Tracker

A simple, beautiful web app to track daily startup ideas from your team of 3 people.

## Features

- ✅ Each person submits 1 idea per day
- 💬 Discuss ideas with comments
- ✏️ Edit your ideas anytime
- 🎨 Beautiful, responsive design
- 💾 Data stored locally in browser

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically detect Next.js and deploy your app.

## Usage

1. Select your name from the dropdown
2. Enter your idea title and description
3. Submit (you can only submit once per day)
4. View all ideas in the grid below
5. Click "Edit" to modify your ideas
6. Add comments to discuss ideas with your team

## Customization

To change the team member names, edit the `PEOPLE` array in `app/page.js`:

```javascript
const PEOPLE = ['Person 1', 'Person 2', 'Person 3']
```

Replace with your actual names!

## Tech Stack

- Next.js 14
- React 18
- Local Storage for data persistence
- Pure CSS (no frameworks needed)
