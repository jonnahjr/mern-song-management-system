import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  // Always use MongoDB Atlas via MONGODB_URI in all environments.
  // Define MONGODB_URI in your environment (Render) and in backend/.env for local dev.
  // Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.bhuyjdw.mongodb.net/musicdb?retryWrites=true&w=majority
  mongoUri: required('MONGODB_URI'),
};
