# WalletWatch API

WalletWatch API is a backend service for managing personal finance, including budgets, expenses, goals, notifications, and user authentication. Built with Node.js and TypeScript, it provides RESTful endpoints for integration with web and mobile clients.

## Features

- User authentication using Email and Password or Google Oauth and session management
- Budget and expense tracking
- Financial goals management
- Monthly Notifications using emails system
- Rate limiting and input validation middleware
- API documentation via Swagger
- Configurable logging and scheduling
- Route Testing using Jest and SuperTest

## Folder Structure

```bash
src/
  app.ts                  # Main application entry point
  routes.ts               # API route definitions
  declarations.d.ts       # TypeScript declarations

  config/                 # Configuration files
    logger.config.ts      # Logger config
    mail.config.ts        # Mail service config
    middleware.config.ts  # Middleware config
    mongodb.config.ts     # MongoDB database config
    passport.config.ts    # Passport.js config
    ratelimit.config.ts   # Rate limit config
    scheduler.config.ts   # Notification scheduler config
    server.config.ts      # Server config
    session.config.ts     # Session management config
    swagger.config.ts     # Swagger API docs config

  controllers/            # Route controllers
    auth.controller.ts    # Auth endpoints
    budget.controller.ts  # Budget endpoints
    expense.controller.ts # Expense endpoints
    goal.controller.ts    # Goal endpoints
    report.controller.ts  # Reporting endpoints

  middleware/             # Express middleware
    authentication.middleware.ts # Auth middleware
    validation.middleware.ts     # Request validation middleware

  models/                 # Data models
    budget.model.ts       # Budget model
    expense.model.ts      # Expense model
    goal.model.ts         # Goal model
    notification.model.ts # Notification model
    user.model.ts         # User model
    
  tests/
    mocks/
      bcrypt.mock.ts      # Bcrypt mock function

    tests/
      auth.test.ts        # Authentication tests
      budget.test.ts      # Budget tests
      expense.test.ts     # Expense tests
      goals.test.ts       # Goal tests

.env                      # Dotenv Environment Variables
.env.example              # Example .env template
.jest.config.js           # Config for jest testing
swagger.json              # Swagger docs configuration
tsconfig.json             # Typescript configuration
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

```bash
npm install
```

### Configuration

- Edit environment variables in `.env` to set up services as needed.

- Create a `.env` file in the root directory with:

```env
# Server Configuration
PORT = 4650
NODE_ENV = development

# Session secret for signing session ID cookies
SESSION_SECRET = sessionsecret

# MongoDB connection URI
MONGO_URI = mongodb://localhost:27017/walletwatch-api

# Email Configuration
SMTP_HOST = smtp.host.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = user@smtp.host.com
SMTP_PASS = smtppassword
SMTP_FROM = app@service.com
APP_URL = http://localhost:4650

# Google OAuth Configuration
GOOGLE_CLIENT_ID = google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = google-client-secret
GOOGLE_REDIRECT_URI = http://localhost:4650/auth/google/callback
```

### Running the API

```bash
npm run start
```

### Development

```bash
npm run dev
```

### Run Jest Testing

```bash
npm run test
```

### API Documentation & Endpoints

Swagger documentation is available at `/docs` when the server is running. See `swagger.json` and `src/config/swagger.config.ts` for details.

### Database Setup

The application uses **MongoDB** as its database. Follow these steps to set it up:

- Install MongoDB on your local machine or use a cloud service like MongoDB Atlas.
- Update the MONGODB_URI in the .env file with your database connection string.
- Start the MongoDB server:

```bash
mongod
```

- The application will automatically create the necessary collections when it starts.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
