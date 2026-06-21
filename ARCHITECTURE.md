# Project Structure Documentation

## Overview
This is a production-ready Express.js backend API built with vanilla JavaScript, Prisma ORM, and PostgreSQL.

## Directory Structure

```
trade-assist-api/
│
├── src/                          # Application source code
│   ├── config/                   # Configuration management
│   │   ├── index.js             # Configuration exports
│   │   ├── database.js          # Database configuration
│   │   └── logger.js            # Winston logger setup
│   │
│   ├── controllers/              # Request handlers
│   │   └── userController.js    # User endpoints
│   │
│   ├── routes/                   # API routes
│   │   ├── index.js             # Route aggregator
│   │   ├── auth.js              # Authentication routes
│   │   └── users.js             # User routes
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Global error handling
│   │   └── requestLogger.js     # Request logging
│   │
│   ├── services/                 # Business logic layer
│   │   └── userService.js       # User business logic
│   │
│   ├── utils/                    # Utility functions
│   │   ├── constants.js         # Application constants
│   │   ├── database.js          # Database utilities
│   │   ├── errors.js            # Error classes
│   │   ├── helpers.js           # Helper functions
│   │   ├── prisma.js            # Prisma client singleton
│   │   └── responses.js         # Response formatters
│   │
│   ├── validators/               # Input validation
│   │   └── index.js             # Validation schemas
│   │
│   ├── app.js                    # Express app setup
│   └── index.js                  # Server entry point
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # Database schema definition
│   ├── migrations/              # Database migrations
│   └── seed.js                  # Database seeding
│
├── tests/                        # Test files
│   └── (test files to be added)
│
├── logs/                         # Application logs
│   ├── error.log               # Error logs
│   └── all.log                 # All logs
│
├── node_modules/               # Dependencies (not committed)
│
├── Configuration Files
│   ├── .env                    # Development environment variables
│   ├── .env.example            # Environment template
│   ├── .env.production         # Production environment variables
│   ├── .env.test               # Test environment variables
│   ├── .gitignore              # Git ignore rules
│   ├── .dockerignore           # Docker ignore rules
│   ├── .prettierrc              # Prettier formatting
│   ├── .eslintrc.json          # ESLint rules
│   ├── jest.config.js          # Jest test configuration
│   ├── package.json            # Dependencies and scripts
│   └── Dockerfile              # Docker container definition
│
├── Documentation
│   ├── README.md               # Main documentation
│   ├── QUICKSTART.md           # Quick start guide
│   ├── CONTRIBUTING.md         # Contributing guidelines
│   └── ARCHITECTURE.md         # This file
│
└── docker-compose.yml          # Docker composition for local development
```

## Key Directories Explained

### `/src/config`
Centralized configuration management for the application. Loads environment variables and exports them through a config object.

**Key files:**
- `database.js` - Database connection configuration
- `logger.js` - Winston logger initialization
- `index.js` - Exports all configurations

### `/src/controllers`
Request handlers that process incoming requests and send responses. Controllers delegate business logic to services.

**Responsibilities:**
- Parse request parameters
- Call appropriate services
- Format and send responses

### `/src/routes`
API endpoint definitions. Routes map HTTP methods to controller functions.

**Structure:**
- Organized by feature (auth, users, trades, etc.)
- Use route grouping for better organization

### `/src/middleware`
Express middleware functions that intercept requests for cross-cutting concerns.

**Examples:**
- `auth.js` - JWT verification
- `errorHandler.js` - Global error handling
- `requestLogger.js` - Request logging

### `/src/services`
Business logic layer. Services contain reusable logic independent of HTTP concerns.

**Responsibilities:**
- Database operations via Prisma
- Business rule implementation
- Data transformation

### `/src/utils`
Reusable utility functions and helper classes.

**Examples:**
- `errors.js` - Custom error classes
- `helpers.js` - Common helper functions
- `responses.js` - Response formatting
- `constants.js` - Application constants

### `/src/validators`
Input validation using express-validator. Ensures incoming data is valid before processing.

### `/prisma`
Prisma ORM configuration and database schema.

**Key files:**
- `schema.prisma` - Database models definition
- `migrations/` - Migration history
- `seed.js` - Database seeding script

## Architecture Pattern

This project follows the **Layered Architecture** pattern:

```
Request
  ↓
Routes (Express Router)
  ↓
Controllers (Request handlers)
  ↓
Middleware (Validation, Auth)
  ↓
Services (Business logic)
  ↓
Data Access (Prisma)
  ↓
Database (PostgreSQL)
```

## Request Flow Example

```
HTTP POST /api/v1/auth/register
  ↓
Router (auth.js) → validateUserCreation, handleValidationErrors
  ↓
Controller (userController.js) → asyncHandler
  ↓
Service (userService.js) → createUser()
  ↓
Prisma → Database Query
  ↓
Response (JSON)
  ↓
Error Middleware (if error) → Error Response
```

## Best Practices Implemented

### 1. **Clean Code**
- Clear, readable JavaScript code
- Consistent naming conventions
- Well-organized file structure

### 2. **Error Handling**
- Custom error classes
- Global error handler middleware
- Standardized error response format

### 3. **Separation of Concerns**
- Controllers handle HTTP concerns
- Services handle business logic
- Middleware handles cross-cutting concerns

### 4. **Configuration Management**
- Environment-based configuration
- Centralized config export
- Sensitive data in environment variables

### 5. **Database Access**
- Prisma ORM for type-safe queries
- Singleton pattern for Prisma client
- Migration system for schema versioning

### 6. **Logging**
- Winston logger for structured logging
- Different log levels for environments
- Separate error and general logs

### 7. **Validation**
- Input validation on all endpoints
- Express-validator for schema validation
- Custom validation rules

### 8. **Security**
- Helmet for HTTP headers
- CORS configuration
- Environment-based security settings
- No sensitive data in logs

### 9. **ES Modules**
- Modern JavaScript with ES6 modules
- Native `import/export` syntax
- Clean and maintainable imports

### 10. **Documentation**
- JSDoc comments where appropriate
- Clear project structure
- Contributing guidelines
- API documentation (README)

## Adding New Features

### Adding a New Route
1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Create service in `src/services/` (if needed)
4. Add validation in `src/validators/` (if needed)
5. Import route in `src/routes/index.js`
6. Use route in `src/app.js`

### Adding a New Database Model
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate -- --name model_name`
3. Prisma auto-generates types
4. Create corresponding service class

### Adding a New Middleware
1. Create file in `src/middleware/`
2. Export middleware function
3. Apply in `src/app.js` or specific routes

## Environment Setup

### Development
Uses `.env` with hot reload and detailed logging

### Production
Uses `.env.production` with optimized settings and minimal logging

### Testing
Uses `.env.test` with test database

## Deployment

```bash
npm install
npm start
```

## Monitoring and Maintenance

### Logs
- Check `logs/error.log` for errors
- Check `logs/all.log` for complete history

### Database
- Use `npm run prisma:studio` for visual data management
- Review migrations in `prisma/migrations/`

### Code Quality
- Run `npm run lint` for code issues
- Run `npm test` for test coverage

## Performance Considerations

1. Use database indexes for frequently queried fields
2. Implement pagination for large datasets
3. Cache static data when appropriate
4. Use connection pooling with Prisma
5. Monitor query performance in logs
6. Use API rate limiting (can be added)

## Security Considerations

1. Always validate and sanitize input
2. Use environment variables for secrets
3. Implement proper authentication/authorization
4. Use HTTPS in production
5. Keep dependencies updated
6. Implement CSRF protection if needed
7. Use database transactions for critical operations

## Scaling

To scale this application:

1. **Horizontal Scaling**: Run multiple instances behind a load balancer
2. **Database**: Use connection pooling, read replicas
3. **Caching**: Implement Redis for frequently accessed data
4. **API Gateway**: Add API gateway for rate limiting, authentication
5. **Monitoring**: Add APM tools for performance monitoring
6. **CI/CD**: Implement automated testing and deployment

For questions or improvements, refer to contributing guidelines.
