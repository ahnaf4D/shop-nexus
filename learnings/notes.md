# Junior MERN Stack Developer Notes

## What I Learned

### 1. Setting Up an Express Server

- Understanding the basics of creating and running an Express server.
- Setting up routes and middleware.
- Handling different types of HTTP requests (GET, POST, PUT, DELETE).

### 2. Development Workflow

- Start working on the backend first, then move to the client side.
- Ensure the backend API endpoints are functional before integrating with the frontend.

### 3. Project Organization

- Organize server-side code inside the `src/` directory to maintain a clean and maintainable project structure.
- Create a main project directory that includes both `client` and `server` folders to separate frontend and backend codebases effectively.
- Within the `server` folder, organize code into subdirectories for routes, controllers, models, and middleware.

### 4. Managing Dependencies

- Install production dependencies using `npm install packageName`.
- Install development dependencies (not needed in production for quicker deployment) using `npm install --save-dev packageName`.

### 5. Using Morgan for Logging

- Utilize the Morgan npm package for logging HTTP requests and responses.
- Helps in debugging and monitoring incoming requests from the client side.

### 6. API Testing

- Always use Postman software for checking REST services as a backend engineer.

---

## Additional Information

### Database Integration

- Learn how to connect your Express server to MongoDB using Mongoose.
- Understand how to define schemas and models for data validation and manipulation.

### Authentication and Authorization

- Implement JWT (JSON Web Token) for secure authentication.
- Understand the difference between authentication (verifying user identity) and authorization (checking user permissions).

### Environment Variables

- Use environment variables to store sensitive information like API keys, database URIs, and JWT secrets.
- Use packages like `dotenv` to manage environment variables.

### Error Handling

- Implement proper error handling to catch and respond to errors gracefully.
- Use middleware to handle errors and send appropriate responses to the client.

### Version Control

- Use Git for version control to manage and track changes in your codebase.
- Understand the basics of branching, merging, and pull requests.

### Testing

- Write tests for your server-side code using frameworks like Mocha, Chai, or Jest.
- Implement unit tests for individual functions and integration tests for API endpoints.

### Security Best Practices

- Validate and sanitize user inputs to prevent SQL injection and XSS attacks.
- Use HTTPS to encrypt data in transit.
- Keep dependencies up-to-date to avoid vulnerabilities.

### Performance Optimization

- Implement caching strategies to reduce server load and improve response times.
- Use tools like PM2 for process management and load balancing.

### Deployment

- Learn how to deploy your application to cloud services like Heroku, AWS, or DigitalOcean.
- Understand the basics of CI/CD (Continuous Integration and Continuous Deployment).

---

By covering these additional topics, you'll be better prepared to handle the responsibilities of a junior MERN stack developer and build more robust and scalable applications.
