<div align="center" paddingBottom="30px">
  <img src="./src/assets/svgs/deliverooLogo.svg" alt="Deliveroo Logo" width="300"/>


A full-stack food delivery application clone inspired by Deliveroo, built with modern web technologies. This project features a React frontend with TypeScript and a Node.js backend with MongoDB.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)

</div>

## ✨ Features

### 🎨 Frontend Features

- **Modern UI/UX** - Clean and responsive design using Material-UI components
- **User Authentication** - Complete auth flow with signup, login, password recovery, and account completion
- **Restaurant Browsing** - Browse all restaurants or filter by categories
- **Menu Viewing** - Detailed restaurant menus with dishes and meal deals
- **Shopping Cart** - Add items to cart and manage orders
- **Search Functionality** - Search for restaurants and dishes
- **Location Services** - Location-based restaurant discovery
- **Responsive Design** - Optimized for desktop and mobile devices
- **Firebase Integration** - Cloud services for authentication and storage
- **State Management** - Redux Toolkit for efficient state management
- **Form Validation** - React Hook Form with Zod schema validation
- **Notifications** - Toast notifications using Notistack
- **Privacy & Data Policies** - Privacy policy and data deletion pages

### 🔧 Backend Features

- **RESTful API** - Built with Node.js and Express
- **MongoDB Database** - NoSQL database for flexible data storage
- **Authentication** - JWT-based authentication system
- **Restaurant Management** - CRUD operations for restaurants
- **Menu Management** - Manage dishes and categories
- **User Management** - User profiles and order history
- **Email Services** - Email notifications and confirmations

## 🏗️ Tech Stack

### Frontend

- **Framework:** React 18.3.1
- **Language:** TypeScript 5.6.2
- **Build Tool:** Vite 6.0.1
- **UI Library:** Material-UI (MUI) 6.3.1
- **State Management:** Redux Toolkit 2.4.0
- **Routing:** React Router DOM 7.0.2
- **Form Handling:** React Hook Form 7.54.2
- **Validation:** Zod 3.24.2
- **HTTP Client:** Axios 1.7.9
- **Authentication:** Firebase 11.4.0, JWT
- **Animations:** Lottie animations
- **Icons:** Lucide React, MUI Icons
- **Notifications:** Notistack 3.0.2

### Backend

- **Runtime:** Node.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## 📁 Project Structure

```
deliveroo-clone-web/
├── src/
│   ├── assets/          # Images, SVGs, and animations
│   ├── data/            # Static data and mock data
│   ├── features/        # Feature-based modules
│   │   └── menu/        # Menu feature
│   │       ├── components/   # UI components
│   │       ├── validations/  # Form validations
│   │       └── views/        # Feature views
│   ├── hocs/            # Higher-order components
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Redux store
│   ├── theme/           # Theme configuration
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── eslint.config.js     # ESLint configuration
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Firebase account (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DiluDevX/deliveroo-clone-web.git
   cd deliveroo-clone-web
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:4000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Set up the backend**

   Navigate to your backend directory and follow backend setup instructions (install dependencies, configure MongoDB connection, etc.)

5. **Start the development server**

   ```bash
   # Frontend (default port: 5173)
   npm run dev

   # Backend (default port: 4000)
   # Run this in your backend directory
   npm start
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format:fix` - Format code with Prettier

## 🔌 API Configuration

The frontend is configured to proxy API requests to the backend server. Check `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

## 🎯 Key Features Implementation

### Authentication Flow

- Email/password signup and login
- Firebase authentication integration
- JWT token management
- Password recovery and reset
- Account completion flow

### Restaurant & Menu System

- Browse restaurants by category
- View detailed restaurant information
- Explore menu items and deals
- Add items to cart
- Category-based filtering

### State Management

The app uses Redux Toolkit for centralized state management, handling:

- User authentication state
- Cart management
- Restaurant data
- Menu items
- UI state

## 🎨 Styling

The project uses:

- **Material-UI** for component library
- **Emotion** for CSS-in-JS styling
- Custom theme configuration in `src/theme/`
- Responsive design patterns

## 🔐 Authentication & Security

- JWT-based authentication
- Firebase authentication integration
- Secure password handling
- Protected routes
- Token refresh mechanism

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

**DiluDevX**

- GitHub: [@DiluDevX](https://github.com/DiluDevX)

## 🙏 Acknowledgments

- Inspired by [Deliveroo](https://deliveroo.co.uk/)
- Built with modern React and TypeScript best practices
- Uses Material-UI component library

## 📧 Contact

For any questions or feedback, please reach out through GitHub issues.

---

**Note:** This is a clone project created for learning and portfolio purposes. It is not affiliated with or endorsed by Deliveroo.
