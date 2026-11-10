import 'dotenv/config';
import app from './app.js';

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('Falta DATABASE_URL o JWT_SECRET en el archivo .env (copia .env.example como .env).');
  process.exit(1);
}

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => console.log(`API Delicia lista en http://localhost:${puerto}/api`));
