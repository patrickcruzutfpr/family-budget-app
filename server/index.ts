import dotenv from 'dotenv';
import { createServer } from './app';

dotenv.config();

const port = Number(process.env.PORT ?? '3001');
const app = createServer();

app.listen(port, () => {
  console.log(`AI proxy listening on http://localhost:${port}`);
});
