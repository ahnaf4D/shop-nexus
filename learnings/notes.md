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

### 7. Express Middlewares

Middleware functions in Express.js are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. They can perform various tasks such as executing code, modifying the request and response objects, ending the request-response cycle, and calling the next middleware in the stack.

#### Commonly Used Middlewares

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

#### Using Middleware in Express

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

#### Explanation

- `app.use(express.json())`: This middleware is used to parse JSON-formatted request bodies. It is particularly useful when working with APIs that send data in JSON format.
- `app.use(express.urlencoded({ extended: true }))`: This middleware is used to parse URL-encoded request bodies, commonly used when submitting forms via HTTP POST. The `extended: true` option allows for rich objects and arrays to be encoded into the URL-encoded format.

By using these middlewares, you can easily handle different types of request bodies in your Express application.

#### For more detailed information and advanced usage of middleware in Express, you can refer to the official documentation: [Express.js Guide: Using Middleware](https://expressjs.com/en/guide/using-middleware.html).

### 8. Express Handling Middlewares

Error handling middlewares are essential in Express applications for managing client-side and server-side errors. These middlewares ensure that errors are properly caught and handled, providing useful feedback to the client and logging critical information for the server.

#### Client Error Handling Middleware

The following middleware handles errors related to client requests, such as requesting a non-existent route. It returns a 404 status code with a JSON response indicating that the route was not found.

```javascript
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
```

#### Server Error Handling Middleware

This middleware handles server-side errors that may occur during the processing of requests. It logs the error stack to the console for debugging purposes and sends a 500 status code response to the client, indicating that an internal server error occurred.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

#### Full Example

Here's a complete example of an Express application incorporating both client and server error handling middlewares:

```javascript
const express = require('express');
const app = express();

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Client error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

#### Explanation

- **Client Error Handling Middleware**: This middleware catches all unmatched routes and sends a 404 error response to the client.

  ```javascript
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });
  ```

- **Server Error Handling Middleware**: This middleware catches errors that occur during request processing, logs the error details, and sends a 500 error response to the client.
  ```javascript
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  ```

In the next lesson, we will explore a package specifically designed for handling errors more efficiently in Express applications.

For more detailed information on handling errors in Express, refer to the official documentation: [Express.js Guide: Error Handling](https://expressjs.com/en/guide/error-handling.html).

### 9. Error Handling with `http-errors`

The `http-errors` package is essential for robust error handling in Express applications. It simplifies the creation of HTTP errors and ensures consistent error responses.

You can find more information and the documentation for `http-errors` [here](https://www.npmjs.com/package/http-errors).

#### Setting Up Error Handling Middleware with `http-errors`

**Client Error Handling Middleware:**

This middleware handles client-side errors, such as requesting non-existent routes. It uses `http-errors` to generate a 404 error and pass it to the next middleware.

```javascript
const createHttpError = require('http-errors');

app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found'));
});
```

**Server Error Handling Middleware:**

This middleware handles all errors, including those generated by `http-errors`. It sends a JSON response with the error status and message.

```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});
```

#### Full Example

Here's a complete example of an Express application incorporating both client and server error handling middlewares using `http-errors`:

```javascript
const express = require('express');
const createHttpError = require('http-errors');
const app = express();

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Client error handling middleware
app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found'));
});

// Server error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

#### Explanation

- **Client Error Handling Middleware**: This middleware catches all unmatched routes and creates a 404 error using `http-errors`.

  ```javascript
  app.use((req, res, next) => {
    next(createHttpError(404, 'Route not found'));
  });
  ```

- **Server Error Handling Middleware**: This middleware catches all errors, logs the error stack (if necessary), and sends a JSON response with the error status and message.
  ```javascript
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  });
  ```

By using `http-errors`, you can create and manage HTTP errors efficiently in your Express application, ensuring clear and consistent error handling across your routes.

### 10. Securing Your API with `xss` and `express-rate-limit`

To secure your API against XSS attacks and rate-limit excessive requests, you can use the `xss` package and the `express-rate-limit` middleware. Below is a professional and well-organized guide to implementing these security measures in your Express application.

#### 1. Install Required Packages

First, install the necessary packages:

```bash
npm install xss express-rate-limit
```

#### 2. Implement XSS Protection Middleware

Use the `xss` package to sanitize user inputs in your API endpoints. This middleware ensures that any string inputs in `req.body` and `req.query` are cleaned to prevent XSS attacks.

```javascript
const xss = require('xss');

app.use((req, res, next) => {
  req.body = JSON.parse(
    JSON.stringify(req.body, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  req.query = JSON.parse(
    JSON.stringify(req.query, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  next();
});
```

#### 3. Implement Rate Limiting

Use the `express-rate-limit` middleware to limit the number of requests a client can make to your API within a specified time window. This helps to prevent abuse and denial-of-service attacks.

```javascript
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

app.use(rateLimiter);
```

#### 4. Full Example

Below is a complete example of an Express application with both XSS protection and rate limiting implemented:

```javascript
const express = require('express');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// XSS protection middleware
app.use((req, res, next) => {
  req.body = JSON.parse(
    JSON.stringify(req.body, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  req.query = JSON.parse(
    JSON.stringify(req.query, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  next();
});

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

app.use(rateLimiter);

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

#### Official Documentation

- [xss package on npm](https://www.npmjs.com/package/xss)
- [express-rate-limit package on npm](https://www.npmjs.com/package/express-rate-limit)

### 11. Setting Up `.env` and `.gitignore`

To keep secure and important credentials hidden from the public, we use a `.env` file for storing environment variables. When pushing code to GitHub, it is crucial to ensure that sensitive files are not included in the repository. To achieve this, we utilize a `.gitignore` file to ignore unwanted files from staging.

Below is a guide to setting up your `.env` and `.gitignore` files for a Node.js project:

#### Creating a `.env` File

1. In the root directory of your project, create a file named `.env`.
2. Add your environment variables to the `.env` file. For example:
   ```
   DATABASE_URL=mongodb://localhost:27017/mydatabase
   JWT_SECRET=mysecretkey
   API_KEY=yourapikey
   ```

#### Setting Up a `.gitignore` File

1. In the root directory of your project, create a file named `.gitignore`.
2. Use the [Node.gitignore template](https://github.com/github/gitignore/blob/main/Node.gitignore) from GitHub to populate your `.gitignore` file. You can download it directly or copy the relevant sections. The template includes common files and directories to ignore in a Node.js project.

By following these steps, you ensure that sensitive information is kept secure and that your project repository remains clean and professional.

#### References

- [Node.gitignore Template](https://github.com/github/gitignore/blob/main/Node.gitignore)

By implementing these practices, you enhance the security and professionalism of your project.
Certainly! Here's a professional and structured outline of the project architecture and practices:

### 12. Explore MVC Pattern

#### Project Structure

```
project-root/
├── controllers/
├── models/
├── routes/
├── .env
├── app.js (or index.js)
└── package.json
```

#### Explanation:

1. **Models (`M`)**:

   - Located in the `models/` directory.
   - Responsible for defining the schema and interacting with the database.

2. **Views (`V`)**:

   - Typically used in server-side rendering (not explicitly shown here if using APIs).
   - In an API-only scenario, responses are usually JSON objects.

3. **Controllers (`C`)**:

   - Located in the `controllers/` directory.
   - Handles the application's business logic.
   - Receives input from routes, interacts with models, and sends responses.

4. **Routes**:

   - Located in the `routes/` directory.
   - Define application endpoints and direct requests to appropriate controller functions.
   - Routes are separated by resource or functionality for clarity and modularity.

5. **Environment Configuration (`dotenv`)**:

   - `.env` file stores environment variables like database connection strings, API keys, etc.
   - Loaded into the application using `dotenv` for better security and configuration management.

6. **Error Handling**:
   - Use `try-catch` blocks in controller functions to catch synchronous errors.
   - Errors are passed to the Express error-handling middleware using `next(error)` for centralized error handling.

#### Best Practices:

- **MVC Separation**:

  - Ensures separation of concerns and maintainability.
  - Models handle data interactions, controllers manage application logic, and routes handle HTTP requests.

- **Error Handling**:

  - Implement consistent error handling across controllers.
  - Use `try-catch` for synchronous errors and `next(error)` to propagate errors to the global error handler.

- **Environment Management**:

  - Securely manage configuration and sensitive information using environment variables.
  - Use `.env` files and `dotenv` to load environment variables into the application.

- **Routing Organization**:

  - Organize routes logically in separate files within the `routes/` directory.
  - Improve readability and scalability by grouping related endpoints.

- **Code Quality**:
  - Follow naming conventions and coding standards to maintain readability.
  - Document code where necessary to explain intent and functionality.

This structured approach ensures clarity, maintainability, and scalability of the Node.js application, adhering to best practices in MVC architecture, routing, error handling, and environment configuration.

Certainly! Here's a structured and formatted document outlining the setup for connecting to MongoDB Atlas and MongoDB Compass using Mongoose in a Node.js application, including configuration files and environment variables:

---

### 13. Connecting to MongoDB Atlas (Cloud) and Compass (Backup)

#### Overview:

- MongoDB Atlas is used for cloud deployment.
- MongoDB Compass is used for local development and as a backup.

#### Steps:

1. **Learn MongoDB and Mongoose (ORM) with TypeScript**:

   - Gain proficiency in using MongoDB for data storage and Mongoose as the ODM (Object Data Modeling) library.
   - Understand TypeScript for type-safe development.

2. **Environment Variables Setup**:

   - Store sensitive information like database URIs in `.env` file.

3. **Config Files (`config/`)**:

   - **`db.js`**: Manages database connection using Mongoose.
   - **`secret.js`**: Optionally used for storing sensitive information or additional configurations.

4. **Models (`models/`)**:
   - Define Mongoose schema and model definitions.
   - Example file: `Task.js` (for defining a Task model).

#### Config Files (`config/`):

- **`db.js`**: Handles MongoDB connection setup using Mongoose.
- **`secret.js`**: Stores sensitive information or additional configurations.

#### Environment Variables (`dotenv`):

- **`.env`**:
  ```
  MONGODB_ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
  MONGODB_COMPASS_URI=mongodb://localhost:27017/<localdbname>
  ```
  - `MONGODB_ATLAS_URI`: URI for MongoDB Atlas cloud deployment.
  - `MONGODB_COMPASS_URI`: URI for MongoDB Compass (local development and backup).

#### Application Entry (`app.js` or `index.js`):

- Main entry point for the Node.js application.
- Initializes Express app, middleware, routes, etc.

#### Models (`models/`):

- Contains Mongoose schema and model definitions.
- Example:
  - `Task.js`: Defines schema for a Task model.

---

This structured document provides a clear outline for connecting to MongoDB using Mongoose, organizing configuration files (`db.js`, `secret.js`), defining environment variables in `.env`, and structuring models in a Node.js application. Adjust paths and configurations based on specific project requirements.

### 14. Explore Mongoose Schema and create models

- Learn how to create a Model and implement a schema.
- Explore [Schemas](https://mongoosejs.com/docs/guide.html), [Schema Types](https://mongoosejs.com/docs/schematypes.html).
- Task for learning Mongoose

### 15. Learn to use seeds api

- Sometimes we need to use dummy data to check health. For that we use seeds api.
- Learn that always give db name `/{DBNAMe}?retryWrites=true&w=majority&appName=Cluster0` in Atlas and use `mongodb://localhost:27017/{DBName}`

### 16. Implement Search , Filter , Pagination features.

- Learn how to filter , pagination , search using mongoose and mongodb and express.

### 17. Implement Response Handler

- These is best practice to make controller for response Control.
- It can be error response or success response
- After implement it i am not use like that `res.send()` I use my own controller

### 18. Learn how to find a specific user with his id

- Learn that How to get specific users with his id
- How to validate input and handle success and errors

### 19. Explore the Concept of service

- The functionality that repeated many times we keep it inside the `services/`
- In these directory we keep the source code of reusable functionality.
- Learn that How to get specific users with his id
- How to validate input and handle success and errors

### 20. Delete API for deleting user

- In these lessons I create a delete endpoint for delete a user
- Also add some code refactoring.

### 21. Introduce with helper/ directory

- Explore Node.js fs module for managing file system.
- Create a utility that removes the remove from the file system.
- I have a confusing That why we going to use `/helper` and `service/` directory.

## Raw Data checking middleware and `xss` middlewares

```javascript
// raw body checking middleware
app.use((req, res, next) => {
  console.log('Raw Body:', req.body);
  next();
});
// xss prevent middleware
app.use((req, res, next) => {
  req.body = JSON.parse(
    JSON.stringify(req.body, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  req.query = JSON.parse(
    JSON.stringify(req.query, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  next();
});
```

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
