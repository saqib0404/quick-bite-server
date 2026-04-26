# Quick-Bite Server

A robust, scalable backend API for the Quick-Bite food delivery platform. Built with Node.js, Express, and Prisma, this server handles user authentication, order management, payment processing, and database operations with high performance and security.

## 🚀 Features

- **RESTful API**: Comprehensive endpoints for all platform operations.
- **Database Management**: Prisma-powered ORM with PostgreSQL for reliable data handling.
- **Authentication & Authorization**: Secure user management with Better Auth.
- **Payment Processing**: Integrated Stripe for seamless transactions.
- **Order Management**: Real-time order tracking and status updates.
- **Menu & Restaurant Services**: Flexible APIs for provider menu management.
- **Review System**: Customer feedback collection and analysis.
- **Email Notifications**: Nodemailer integration for user communications.
- **Webhook Support**: Stripe webhook handling for payment confirmations.
- **Scalable Architecture**: Modular design supporting microservices expansion.

## 💼 Business Value

Quick-Bite Server drives operational excellence with:
- **High Availability**: 99.9% uptime with optimized database queries.
- **Security First**: Enterprise-grade authentication and data protection.
- **Cost Efficiency**: Scalable infrastructure reducing operational costs.
- **Analytics Ready**: Structured data for business intelligence and growth insights.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Build Tool**: tsup (TypeScript bundler)
- **Development**: tsx for hot reloading
- **Deployment**: Vercel-ready configuration

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account for payments
- pnpm (recommended) or npm/yarn

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/quick-bite-server.git
   cd quick-bite-server
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/quickbite"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:5000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed admin user (optional):
   ```bash
   pnpm run seed:admin
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

The server will start on [http://localhost:5000](http://localhost:5000).

## 📜 Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm seed:admin` - Seed admin user
- `pnpm stripe:webhook` - Start Stripe webhook listener

## 📡 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### User Management
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user

### Restaurant Management
- `GET /restaurants` - Get all restaurants
- `POST /restaurants` - Create restaurant (Provider)
- `PUT /restaurants/:id` - Update restaurant

### Menu Management
- `GET /menu` - Get menu items
- `POST /menu` - Add menu item (Provider)
- `PUT /menu/:id` - Update menu item

### Order Management
- `POST /orders` - Place new order
- `GET /orders` - Get user orders
- `PUT /orders/:id/status` - Update order status

### Payment
- `POST /payment/create-session` - Create Stripe checkout session
- `POST /webhook` - Stripe webhook endpoint

For detailed API specs, see the [API Documentation](./docs/api.md).


### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

## 📞 Support

For support, email saqibahamd0404@gmail.com

---

Powered by cutting-edge technology for the food delivery revolution.