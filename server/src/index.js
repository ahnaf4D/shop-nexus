import app from './app.js';
import { port } from './secret.js';

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
