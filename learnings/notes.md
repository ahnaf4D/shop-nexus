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

## 7. Express Middlewares

Middleware functions in Express.js are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. They can perform various tasks such as executing code, modifying the request and response objects, ending the request-response cycle, and calling the next middleware in the stack.

### Commonly Used Middlewares

1. **express.json() Middleware**

   ```javascript
   app.use(express.json());
   ```

   This middleware parses incoming requests with JSON payloads. It is based on `body-parser` and is a built-in middleware in Express. When a request is received with a JSON body, this middleware parses it and makes it accessible through `req.body`.

2. **express.urlencoded() Middleware**
   ```javascript
   app.use(express.urlencoded({ extended: true }));
   ```
   This middleware parses incoming requests with URL-encoded payloads. It is also based on `body-parser` and is built-in in Express. The `extended` option allows you to choose between parsing the URL-encoded data with the `querystring` library (when `false`) or the `qs` library (when `true`). The `qs` library supports rich objects and arrays, which means it can parse nested objects and arrays more effectively.

### Using Middleware in Express

Here is an example of how you can set up these middlewares in an Express application:

```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Example route
app.post('/submit-form', (req, res) => {
  console.log(req.body); // Access the parsed form data
  res.send('Form data received');
});

// Example route
app.post('/submit-json', (req, res) => {
  console.log(req.body); // Access the parsed JSON data
  res.send('JSON data received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Explanation

- `app.use(express.json())`: This middleware is used to parse JSON-formatted request bodies. It is particularly useful when working with APIs that send data in JSON format.
- `app.use(express.urlencoded({ extended: true }))`: This middleware is used to parse URL-encoded request bodies, commonly used when submitting forms via HTTP POST. The `extended: true` option allows for rich objects and arrays to be encoded into the URL-encoded format.

By using these middlewares, you can easily handle different types of request bodies in your Express application.

## For more detailed information and advanced usage of middleware in Express, you can refer to the official documentation: [Express.js Guide: Using Middleware](https://expressjs.com/en/guide/using-middleware.html).

## Add Some API Testing Endpoints

To ensure your API is functioning correctly, add the following testing endpoints to your Express server:

```javascript
app.get('/test', (req, res) => {
  res.status(200).send({ message: 'GET: API working fine' });
});

app.post('/test', (req, res) => {
  res.status(200).send({ message: 'POST: API working fine' });
});

app.put('/test', (req, res) => {
  res.status(200).send({ message: 'PUT: API working fine' });
});

app.delete('/test', (req, res) => {
  res.status(200).send({ message: 'DELETE: API working fine' });
});
```

You can verify these endpoints using Postman. Below is a demo of the GET request:

![Postman Demo](https://i.ibb.co/z8XZtyn/Screenshot-1.png)

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
