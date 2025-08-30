# WalletWatch API

WalletWatch API is a backend service for managing personal finance, including budgets, expenses, goals, notifications, and user authentication. Built with Node.js and TypeScript, it provides RESTful endpoints for integration with web and mobile clients.

## Features

- User authentication and session management
- Budget and expense tracking
- Financial goals management
- Notifications system
- Rate limiting and validation middleware
- API documentation via Swagger
- Configurable logging and scheduling

## Folder Structure

```bash
src/
  app.ts                  # Main application entry point
  routes.ts               # API route definitions
  declarations.d.ts       # TypeScript declarations
  config/                 # Configuration files
    database.config.ts    # Database setup
    logger.config.ts      # Logger setup
    mail.config.ts        # Mail service config
    middleware.config.ts  # Middleware config
    passport.config.ts    # Passport.js config
    scheduler.config.ts   # Notification scheduler config
    session.config.ts     # Session management config
    swagger.config.ts     # Swagger API docs config
  controllers/            # Route controllers
    auth.controller.ts    # Auth endpoints
    budget.controller.ts  # Budget endpoints
    expense.controller.ts # Expense endpoints
    report.controller.ts  # Reporting endpoints
  middleware/             # Express middleware
    authentication.middleware.ts # Auth middleware
    ratelimit.middleware.ts      # Rate limiting
    validation.middleware.ts     # Request validation
  models/                 # Data models
    budget.model.ts       # Budget model
    expense.model.ts      # Expense model
    goal.model.ts         # Goal model
    notification.model.ts # Notification model
    user.model.ts         # User model
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB

### Installation

```bash
npm install
```

### Configuration

Edit environment variables in `.env` to set up services as needed.

### Running the API

```bash
npm start
```

### Development

```bash
npm run dev
```

### API Documentation

Swagger documentation is available at `/docs` when the server is running. See `swagger.json` and `src/config/swagger.config.ts` for details.

## Usage

- Register and authenticate users
- Create, update, and delete budgets and expenses
- Set financial goals
- Receive notifications
- Generate financial reports

## To-do List

- Swagger Docs cleanup and Postman Collection
- Add more endpoints and controller functionality
- Code Cleanup
- Testing using Jest + Supertest
- More methods attached to Models
- JWT auth
- Option to use SQL database

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
