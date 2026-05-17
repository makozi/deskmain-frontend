# DeskMain Frontend

Global Commerce Operating System - Frontend Application

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Run Development Server

```bash
npm run dev
```

App runs on `http://localhost:3000`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
npm run format   # Format code with prettier
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── auth/       # Authentication pages
│   ├── merchant/   # Merchant pages
│   ├── customer/   # Customer pages
│   └── admin/      # Admin pages
├── services/       # API services
├── hooks/          # Custom React hooks
├── store/          # State management (Zustand)
├── styles/         # CSS files
├── assets/         # Images and icons
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Pages

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Customer Pages
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/orders/:id` - Order details

### Merchant Pages
- `/merchant/dashboard` - Merchant dashboard
- `/merchant/products` - Product management
- `/merchant/orders` - Order management
- `/merchant/payouts` - Payout management

### Admin Pages
- `/admin/dashboard` - Admin dashboard

## Components

- **Navbar** - Navigation bar with menu
- **Footer** - Footer with links
- (More components to be added)

## Styling

Uses **Tailwind CSS 4.0** with custom configuration for:
- Primary colors (primary-50 to primary-900)
- Secondary colors (secondary-50 to secondary-900)
- Custom animations
- Responsive design

## API Integration

All API calls use the `services/api.js` service which:
- Handles authentication headers
- Manages JWT tokens
- Handles redirects on auth errors
- Provides consistent error handling

## State Management

Uses **Zustand** for global state management (to be implemented).

## Features

- Responsive design for mobile, tablet, and desktop
- React Router v6 for routing
- Axios for API calls
- Tailwind CSS for styling
- React Icons for icon library
- Framer Motion for animations
- Chart.js for analytics
- Toast notifications with react-hot-toast

## Development Notes

- All environment variables must be prefixed with `VITE_`
- Component files are in `.jsx` format
- CSS is written using Tailwind utility classes
- API endpoints are prefixed with `/api/v1`

## Deployment

Build the project for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Support

For issues or questions, please contact support@deskmain.com
