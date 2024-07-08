import app from './app.js';
import connectDB from './config/db.js';
import { port } from './secret.js';

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});
