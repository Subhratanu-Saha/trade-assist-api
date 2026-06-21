# Trade Assist API

A modern Express.js backend API built with vanilla JavaScript, Prisma ORM, and PostgreSQL.

## Features

- ✅ Express.js server with JavaScript (ES modules)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Environment configuration management
- ✅ Request validation with express-validator
- ✅ Error handling middleware
- ✅ Request logging with Winston
- ✅ Security with Helmet and CORS
- ✅ Docker Compose setup for PostgreSQL
- ✅ Industry best practices
- ✅ Hot reload with Nodemon in development

## Project Structure

```
src/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Express middleware
├── routes/              # API routes
├── services/            # Business logic
├── types/               # (Reserved for future enhancements)
├── utils/               # Utility functions
├── validators/          # Input validation
├── app.js              # Express app setup
└── index.js            # Server entry point

prisma/
├── schema.prisma       # Prisma database schema
└── migrations/         # Database migrations
```

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 13+ (or use Docker)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trade-assist-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL**

   Install and start PostgreSQL locally, then update the `DATABASE_URL` in `.env` with your connection string

4. **Configure environment**
   
   Update `.env` with your database connection string and other configuration (optional for basic app)

5. **Setup Prisma (Optional)**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`

## Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm start               # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm test                # Run tests
npm run test:watch      # Run tests in watch mode

# Optional Prisma commands
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Create and apply migrations
npm run prisma:studio   # Open Prisma Studio GUI
npm run prisma:seed     # Run database seed
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Base
- `GET /api/v1` - API version and status

## Environment Variables

Configure `.env` with the following variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `LOG_LEVEL` - Logging level
- `CORS_ORIGIN` - CORS allowed origin

## Database Schema

Models are defined in `prisma/schema.prisma`. Current models:

- **User** - Application users
- **Trade** - Trade records
- **AuditLog** - Audit trail

Modify the schema as needed and run migrations.

## Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Logging

Logs are stored in the `logs/` directory:
- `logs/error.log` - Error logs only
- `logs/all.log` - All logs

## Testing

Run the test suite:
```bash
npm test
```

## Linting

Check code quality:
```bash
npm run lint
```

Fix issues automatically:
```bash
npm run lint:fix
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

MIT
