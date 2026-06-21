## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update `.env` with your configuration (optional for basic app)

### 3. Start Development Server
```bash
npm run dev
```

The API is now running at `http://localhost:5000/api/v1`

## Next Steps

1. **Create API Routes**: Add new route files in `src/routes/`
2. **Implement Controllers**: Add business logic in `src/controllers/`
3. **Add Services**: Create service classes in `src/services/`
4. **(Optional) Setup Database**: Configure Prisma with `npx prisma migrate dev --name init`
5. **Add Tests**: Create test files in `tests/`

## Important Files

- `.env` - Environment variables configuration
- `prisma/schema.prisma` - Database schema
- `src/app.js` - Express app configuration
- `src/index.js` - Server entry point

## Common Commands

```bash
npm run dev              # Start dev server
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm test                 # Run tests

# Optional Prisma commands
npm run prisma:migrate   # Create database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database
```

## Documentation

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Project Structure Best Practices

- **Separation of Concerns**: Controllers, Services, and Routes are separated
- **Environment Management**: Environment-specific configurations
- **Error Handling**: Centralized error handling middleware
- **Logging**: Winston logger for application logging
- **Validation**: Input validation using express-validator
- **Security**: Helmet for HTTP headers and CORS configuration
- **Database**: Prisma ORM for type-safe database access

## Troubleshooting

### Port Already in Use
Change the PORT in `.env` file

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database user has correct permissions

### Module Not Found Errors
- Run `npm install` again
- Verify import paths are correct

## Support

For issues and questions, refer to the README.md file.
