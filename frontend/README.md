# Pokemon Review Frontend

A modern, responsive Next.js frontend for the Pokemon Review API.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- ⚡ Fast page loads with Next.js 14
- 🔄 Full CRUD operations for Pokemon, Reviews, and Categories
- 🎯 Interactive components with real-time updates

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `https://localhost:7177`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, defaults to `https://localhost:7177`):
```env
NEXT_PUBLIC_API_URL=https://localhost:7177/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── categories/        # Category pages
│   ├── pokemon/           # Pokemon pages
│   ├── reviews/           # Review pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   └── DeleteButton.tsx   # Delete confirmation component
├── lib/                   # Utility functions
│   └── api.ts             # API client
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── package.json           # Dependencies
```

## Available Pages

- **Home** (`/`) - Displays all Pokemon
- **Pokemon** (`/pokemon`) - List all Pokemon
- **Pokemon Detail** (`/pokemon/[id]`) - View Pokemon details and reviews
- **Create Pokemon** (`/pokemon/new`) - Create a new Pokemon
- **Edit Pokemon** (`/pokemon/[id]/edit`) - Edit a Pokemon
- **Reviews** (`/reviews`) - List all reviews
- **Create Review** (`/reviews/new`) - Create a new review
- **Edit Review** (`/reviews/[id]/edit`) - Edit a review
- **Categories** (`/categories`) - List all categories
- **Category Detail** (`/categories/[id]`) - View category and associated Pokemon
- **Create Category** (`/categories/new`) - Create a new category
- **Edit Category** (`/categories/[id]/edit`) - Edit a category

## API Configuration

The frontend connects to the backend API. Make sure:

1. The backend is running on `https://localhost:7177`
2. CORS is properly configured in the backend (already configured)
3. The API endpoints match the expected structure
4. **SSL Certificate Note**: If you get SSL certificate errors when the frontend tries to connect:
   - First, visit `https://localhost:7177/swagger/index.html` in your browser and accept the certificate
   - For server-side requests (Next.js server components), you may need to set `NODE_TLS_REJECT_UNAUTHORIZED=0` in your environment (development only)

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

